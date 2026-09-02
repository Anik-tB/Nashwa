import React, { useState, useEffect } from "react";
import { BookOpen, Star, Users, ClockCircle, Check, X, Sparkles } from "@mynaui/icons-react";
import { useAuth } from "../../context/AuthContext";

const UniversitySection = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollCourse, setEnrollCourse] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("/api/university")
      .then((res) => res.json())
      .then((data) => setCourses(data.courses || []))
      .catch((err) => console.error("Error fetching university courses:", err))
      .finally(() => setLoading(false));
  }, []);

  const openEnrollModal = (course) => {
    setEnrollCourse(course);
    setStudentName(user ? user.name : "");
    setStudentEmail(user ? user.email : "");
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim()) {
      setErrorMessage("Please fill in both name and email.");
      return;
    }

    setEnrolling(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/university/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: enrollCourse.id,
          student_name: studentName,
          student_email: studentEmail
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Enrollment failed");

      // Update local courses count
      setCourses((prev) =>
        prev.map((c) =>
          c.id === enrollCourse.id
            ? { ...c, students_count: c.students_count + 1 }
            : c
        )
      );

      setSuccessMessage(data.message);
      setTimeout(() => {
        setEnrollCourse(null);
      }, 2500);
    } catch (err) {
      setErrorMessage(err.message || "Failed to complete enrollment.");
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-[#BA5B55] bg-[#BA5B55]/10 px-3 py-1 rounded-full">
          Academy of Craft & Commerce
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E180D] mt-3 tracking-tight font-serif">
          Nashwa University
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
          Master the living traditions of craft, botanical formulation, ancient breadmaking, and ethical artisan enterprise directly from master guilds.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse h-72"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-[#BA5B55]/30 hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row"
            >
              {/* Image */}
              <div className="sm:w-2/5 relative h-52 sm:h-auto overflow-hidden bg-gray-100">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#1E180D]/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  {course.category}
                </span>
              </div>

              {/* Body */}
              <div className="sm:w-3/5 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1 font-medium text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md">
                      <ClockCircle size={14} /> {course.duration}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span className="font-bold text-gray-900">{course.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#BA5B55] transition-colors leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs text-[#BA5B55] font-semibold mt-1">
                    Mentor: {course.instructor}
                  </p>

                  <p className="text-xs text-gray-600 mt-2.5 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Users size={14} /> {course.students_count} enrolled
                    </span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xl font-extrabold text-[#1E180D]">
                    ${course.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => openEnrollModal(course)}
                    className="px-4 py-2 bg-[#BA5B55] hover:bg-[#a34d47] text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-98 cursor-pointer flex items-center gap-1.5"
                  >
                    <BookOpen size={16} /> Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enrollment Modal */}
      {enrollCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setEnrollCourse(null)}
              aria-label="Close"
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#BA5B55] bg-[#BA5B55]/10 px-2.5 py-0.5 rounded-full">
                Course Enrollment
              </span>
              <h3 className="text-xl font-bold text-gray-900 mt-2 leading-tight">
                {enrollCourse.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Instructor: {enrollCourse.instructor} • ${enrollCourse.price.toFixed(2)}
              </p>
            </div>

            {successMessage ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-800 text-sm font-medium flex items-center gap-2">
                <Check size={20} className="shrink-0 text-green-600" />
                <span>{successMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleEnrollSubmit} className="flex flex-col gap-4 mt-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl text-xs font-medium bg-red-50 text-red-800 border border-red-200">
                    {errorMessage}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BA5B55]/20 focus:border-[#BA5B55] text-sm text-gray-900"
                    placeholder="Your name"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Student Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BA5B55]/20 focus:border-[#BA5B55] text-sm text-gray-900"
                    placeholder="you@example.com"
                  />
                </div>

                <p className="text-[11px] text-gray-400">
                  Includes lifetime access to workshop recordings, syllabus downloads, and private discussion circle.
                </p>

                <button
                  type="submit"
                  disabled={enrolling}
                  className={`w-full py-3 bg-[#BA5B55] hover:bg-[#a34d47] text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
                    enrolling ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  <Sparkles size={16} />
                  {enrolling ? "Confirming Enrollment..." : `Complete Enrollment • $${enrollCourse.price.toFixed(2)}`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversitySection;
