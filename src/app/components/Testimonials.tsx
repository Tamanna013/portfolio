import React, { useState, useRef, useEffect } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

const Testimonials = () => {
  const [testimonial, setTestimonial] = useState({
    name: "",
    text: "",
  });

  const [submittedTestimonials, setSubmittedTestimonials] = useState<
    Array<{ name: string; text: string; drawing: string }>
  >([]);

  const [strokeColor, setStrokeColor] = useState("white");

  useEffect(() => {
    const storedTestimonials = localStorage.getItem("testimonials");
    if (storedTestimonials) {
      setSubmittedTestimonials(JSON.parse(storedTestimonials));
    }
  }, []);

  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTestimonial((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStrokeColor(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (testimonial.name && testimonial.text) {
      try {
        const drawing = await canvasRef.current?.exportImage("png");

        const newTestimonials = [
          ...submittedTestimonials,
          { name: testimonial.name, text: testimonial.text, drawing: drawing || "" },
        ];

        setSubmittedTestimonials(newTestimonials);
        setTestimonial({ name: "", text: "" });

        if (canvasRef.current) {
          canvasRef.current.resetCanvas();
        }

        // Save to localStorage
        localStorage.setItem("testimonials", JSON.stringify(newTestimonials));
      } catch (error) {
        console.error("Failed to export drawing", error);
      }
    }
  };

  const clearDrawing = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  };
  
  const deleteTestimonial = (index: number) => {
    const updatedTestimonials = [...submittedTestimonials];
    updatedTestimonials.splice(index, 1);
    setSubmittedTestimonials(updatedTestimonials);
    localStorage.setItem("testimonials", JSON.stringify(updatedTestimonials));
  };

  const getRandomPosition = () => {
    const top = Math.random() * 70 + 10;
    const left = Math.random() * 70 + 10;
    return { top: `${top}%`, left: `${left}%` };
  };

  return (
    <section className="bg-black text-white py-16 px-6">
      <h2 className="text-5xl font-bold text-center mb-12">Testimonials</h2>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Form Section */}
        <div className="md:w-1/2 bg-black p-8 border-2 border-white rounded-lg shadow-lg">
          <h3 className="text-3xl font-semibold mb-6">Leave Your Testimonial</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-lg">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={testimonial.name}
                onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-white text-white p-2 mt-2"
                required
              />
            </div>

            <div>
              <label htmlFor="text" className="block text-lg">Testimonial</label>
              <textarea
                id="text"
                name="text"
                value={testimonial.text}
                onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-white text-white p-2 mt-2 h-32"
                required
              />
            </div>

            {/* Drawing Section */}
            <div>
              {/* Color Picker */}
              <div className="flex items-center mb-4">
                <label className="mr-2">Pick a color:</label>
                <input
                  type="color"
                  value={strokeColor}
                  onChange={handleColorChange}
                  className="w-10 h-10 border-2 border-white"
                />
              </div>

              <ReactSketchCanvas
                ref={canvasRef}
                width="100%"
                height="300px"
                strokeColor={strokeColor}
                strokeWidth={3}
                className="border-2 border-white rounded-lg"
              />
            </div>

            <div className="flex justify-between gap-4 mt-4">
              <button
                type="submit"
                className="w-2/3 bg-white text-black py-3 font-semibold rounded-lg hover:bg-gray-200 transition"
              >
                Submit Testimonial
              </button>

              <button
                type="button"
                onClick={clearDrawing}
                className="w-1/3 bg-gray-600 text-white py-3 font-semibold rounded-lg hover:bg-gray-700 transition"
              >
                Clear Drawing
              </button>
            </div>
          </form>
        </div>

        {/* Submitted Testimonials Section */}
        <div className="md:w-1/2 bg-black p-8 border-2 border-white rounded-lg shadow-lg relative overflow-hidden">
          <h3 className="text-3xl font-semibold mb-6">Submitted Testimonials</h3>
          <div className="relative w-full h-full">
            {submittedTestimonials.map((testimonial, index) => {
              const position = getRandomPosition();
              return (
                <div
                  key={index}
                  className="border-2 border-white p-4 rounded-lg bg-black text-white absolute"
                  style={{ top: position.top, left: position.left }}
                >
                  <p className="text-xl font-semibold">{testimonial.name}</p>
                  <p className="text-lg mt-2">{testimonial.text}</p>
                  {testimonial.drawing && (
                    <div className="mt-4">
                      <img
                        src={testimonial.drawing}
                        alt={`drawing-${index}`}
                        className="max-w-full"
                      />
                    </div>
                  )}
                  <div className="mt-4 flex gap-2">

                    {/* Delete Button */}
                    <button
                      type="button"
                      className="bg-red-500 text-white py-1 px-3 rounded-lg"
                      onClick={() => deleteTestimonial(index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
