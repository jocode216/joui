import { Link } from "react-router-dom";

const CoursesShowcase: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-center gap-5 w-[90%] mx-auto my-5 min-h-[70vh] pb-12">
      {/* MERN Stack Course - Manual Card */}
      <div className="p-5 border border-gray-200 rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards] w-full md:w-[calc(50%-20px)]">
        <img
          src="https://img.youtube.com/vi/EVFYZl91j8A/hqdefault.jpg"
          alt="MERN Stack Mentorship Full Guide"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://img.youtube.com/vi/EVFYZl91j8A/hqdefault.jpg";
          }}
          className="w-full h-auto rounded-lg mb-4"
        />
        <h3 className="text-[clamp(18px,4vw,22px)] font-bold text-gray-800 leading-tight border-l-4 border-[#667eea] pl-4 mb-4">
          MERN Stack Mentorship Full Guide
        </h3>
        <p className="text-[clamp(14px,3vw,16px)] text-gray-600 leading-relaxed mb-4">
          Learn real application architecture, folder structure, authentication
          flows, All CRUD operations, and deployment - the practical knowledge
          most courses skip,
          <strong className="font-bold">You know the basics.</strong> Now learn
          how to connect React, Node.js, Express, and MySQL into{" "}
          <strong className="font-bold">
            complete, deployable applications
          </strong>
          .
        </p>

        <div className="flex gap-2.5 mt-5">
          <Link to="/detail" className="flex-1">
            <button className="w-full py-3 px-4 border-none rounded-md font-semibold text-[clamp(14px,3vw,16px)] cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 bg-gray-600 text-white">
              Details
            </button>
          </Link>
        </div>
      </div>

      <div className="p-5 border border-gray-200 rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards] [animation-delay:0.2s] w-full md:w-[calc(50%-20px)]">
        <img
          src="https://img.youtube.com/vi/9u8LjczycLE/hqdefault.jpg"
          alt="HTML Foundation"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://img.youtube.com/vi/EVFYZl91j8A/hqdefault.jpg";
          }}
          className="w-full h-auto rounded-lg mb-4"
        />
        <h3 className="text-[clamp(18px,4vw,22px)] font-bold text-gray-800 leading-tight border-l-4 border-[#667eea] pl-4 mb-4">
          HTML Full Course
        </h3>
        <p className="text-[clamp(14px,3vw,16px)] text-gray-600 leading-relaxed mb-4">
          Master the core foundation of web development. Perfect for ensuring
          your basics are rock-solid before diving into full-stack application
          development.
          <span className="text-[#ff6b35] text-2xl font-bold block mt-2">
            Completely Free
          </span>
        </p>

        <div className="flex gap-2.5 mt-5">
          <Link to="/html" className="flex-1">
            <button className="w-full py-3 px-4 border-none rounded-md font-semibold text-[clamp(14px,3vw,16px)] cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 bg-emerald-600 text-white">
              Start Learning Free
            </button>
          </Link>
        </div>
      </div>

      {/* You can add more courses manually like this */}
      {/* <div className="p-5 border border-gray-200 rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards] [animation-delay:0.3s] w-full md:w-[calc(50%-20px)]">
        <img
          src="https://josephteka.com/jocode.jpg"
          alt="Course Title"
          className="w-full h-auto rounded-lg mb-4"
        />
        <h3 className="text-[clamp(18px,4vw,22px)] font-bold text-gray-800 leading-tight border-l-4 border-[#667eea] pl-4 mb-4">Mathematics</h3>
        <p className="text-[clamp(14px,3vw,16px)] text-gray-600 leading-relaxed mb-4">Learn mathematics the way it is impossible to not understand.</p>
        <div className="flex gap-2.5 mt-5">
          <Link to="/maths" className="flex-1">
            <button className="w-full py-3 px-4 border-none rounded-md font-semibold text-[clamp(14px,3vw,16px)] cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 bg-gray-600 text-white">Details</button>
          </Link>
        </div>
      </div> */}
    </div>
  );
};

export default CoursesShowcase;
