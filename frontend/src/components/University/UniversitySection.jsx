import React, { useState, useEffect } from "react";
import { BookOpen, Star, Users, ClockCircle, Check, X, Sparkles, Badge, ShieldCheck } from "@mynaui/icons-react";
import { useAuth } from "../../context/AuthContext";
import { useCurrency } from "../../context/CurrencyContext";

const UniversitySection = () => {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState("all");

  // Enrollment state
  const [enrollCourse, setEnrollCourse] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [enrolledPass, setEnrolledPass] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Syllabus Modal State
  const [syllabusCourse, setSyllabusCourse] = useState(null);

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
    setEnrolledPass(null);
    setErrorMessage("");
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim()) {
      setErrorMessage("Please provide both your name and email.");
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
          student_name: studentName.trim(),
          student_email: studentEmail.trim()
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

      // Generate digital credential pass
      const passId = `NSH-STU-${Math.floor(100000 + Math.random() * 900000)}`;
      setEnrolledPass({
        passId,
        studentName: studentName.trim(),
        studentEmail: studentEmail.trim(),
        courseTitle: enrollCourse.title,
        instructor: enrollCourse.instructor,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to complete enrollment.");
    } finally {
      setEnrolling(false);
    }
  };

  // Mock syllabus module generator
  const getSyllabusModules = (course) => {
    return [
      {
        week: "Week 01",
        title: "Historical Lineage & Ancestral Sourcing",
        topics: ["Ethics of wild harvesting", "Material terroir & provenance", "Preparation of traditional tools"]
      },
      {
        week: "Week 02",
        title: "Core Formulation & Guild Science",
        topics: ["Pyramid blending ratios", "Temperature & slow maceration", "Preventing degradation"]
      },
      {
        week: "Week 03",
        title: "Hand Execution & Sensory Calibration",
        topics: ["Precision sensory testing", "Fixation and stability", "Small-batch consistency"]
      },
      {
        week: "Week 04",
        title: "Master Critique & Guild Certification",
        topics: ["One-on-one portfolio review", "Capstone guild project", "Receiving verified accreditation"]
      }
    ];
  };

  const filteredCourses = courses.filter((c) => {
    if (levelFilter === "all") return true;
    return c.level.toLowerCase().includes(levelFilter.toLowerCase());
  });

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#BA5B55] bg-[#BA5B55]/10 px-3 py-1 rounded-full">
          Academy of Slow Craft & Artisan Commerce
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1E180D] mt-3 tracking-tight font-serif">
          Nashwa University
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
          Master the living traditions of natural perfumery, ancient hearth baking, mountain ceramics, and fair-trade business directly from master guilds.
        </p>

        {/* Level filter tabs */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {[
            { id: "all", label: "All Masterclasses" },
            { id: "all levels", label: "All Levels" },
            { id: "intermediate", label: "Intermediate Guilds" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setLevelFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                levelFilter === tab.id
                  ? "bg-[#1E180D] text-white shadow-xs"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse h-72"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group bg-white rounded-3xl overflow-hidden border border-amber-900/10 hover:border-[#BA5B55]/40 hover:shadow-2xl transition-all duration-300 flex flex-col sm:flex-row"
            >
              {/* Image */}
              <div className="sm:w-2/5 relative h-52 sm:h-auto overflow-hidden bg-gray-100">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <span className="absolute top-3 left-3 bg-[#1E180D]/85 backdrop-blur-md text-amber-100 text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {course.category}
                </span>
              </div>

              {/* Body */}
              <div className="sm:w-3/5 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1 font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md text-[11px]">
                      <ClockCircle size={13} /> {course.duration}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      <span className="font-bold text-gray-900 text-xs">{course.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#BA5B55] transition-colors leading-snug font-serif">
                    {course.title}
                  </h3>

                  <p className="text-xs text-[#BA5B55] font-semibold mt-1">
                    Master Mentor: {course.instructor}
                  </p>

                  <p className="text-xs text-gray-600 mt-2.5 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Users size={14} className="text-[#BA5B55]" /> {course.students_count} enrolled
                    </span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-700 text-[11px] font-semibold">
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Actions & Price */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                  <span className="text-xl font-black text-[#1E180D] font-serif">
                    {formatPrice(course.price)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSyllabusCourse(course)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Syllabus
                    </button>

                    <button
                      onClick={() => openEnrollModal(course)}
                      className="px-4 py-2 bg-[#BA5B55] hover:bg-[#a34d47] text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer flex items-center gap-1.5"
                    >
                      <BookOpen size={15} /> Enroll
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Syllabus Modal */}
      {syllabusCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-900/15 animate-modal-enter max-h-[88vh] overflow-y-auto">
            <button
              onClick={() => setSyllabusCourse(null)}
              aria-label="Close"
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <span className="text-[10px] font-black uppercase tracking-widest text-[#BA5B55] bg-[#BA5B55]/10 px-2.5 py-0.5 rounded-full">
              Guild Syllabus & Curriculum
            </span>

            <h3 className="text-xl font-bold font-serif text-gray-950 mt-2 leading-snug">
              {syllabusCourse.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Led by {syllabusCourse.instructor} • {syllabusCourse.duration}
            </p>

            <div className="mt-6 space-y-3">
              {getSyllabusModules(syllabusCourse).map((mod, i) => (
                <div key={i} className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#BA5B55]">
                      {mod.week}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">Live & Lab Hours</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">{mod.title}</h4>
                  <ul className="mt-2 space-y-1">
                    {mod.topics.map((t, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#BA5B55]/60"></span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
              <span className="text-lg font-black text-gray-900 font-serif">
                {formatPrice(syllabusCourse.price)}
              </span>
              <button
                onClick={() => {
                  const c = syllabusCourse;
                  setSyllabusCourse(null);
                  openEnrollModal(c);
                }}
                className="px-5 py-2.5 bg-[#BA5B55] hover:bg-[#a34d47] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Enroll in Masterclass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment & Digital Pass Modal */}
      {enrollCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-900/15 animate-modal-enter">
            <button
              onClick={() => setEnrollCourse(null)}
              aria-label="Close"
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {enrolledPass ? (
              /* Digital Pass Result */
              <div className="space-y-4 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 border border-emerald-200">
                  <Badge size={28} />
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Enrollment Confirmed
                  </span>
                  <h3 className="text-xl font-bold font-serif text-gray-950 mt-2">
                    Official Student Credential
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Your seat is verified. Access credentials delivered to {enrolledPass.studentEmail}.
                  </p>
                </div>

                {/* The Pass Card */}
                <div className="p-5 bg-gradient-to-br from-[#1E180D] via-[#2E2415] to-[#1E180D] text-white rounded-2xl text-left shadow-lg border border-amber-500/30 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-[#D4A373] font-bold">
                        Nashwa Academy Student Pass
                      </p>
                      <h4 className="text-sm font-bold text-amber-50 font-serif leading-snug mt-0.5">
                        {enrolledPass.courseTitle}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-amber-300/80 bg-white/10 px-2 py-0.5 rounded">
                      {enrolledPass.passId}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-white/10 text-amber-100/90">
                    <div>
                      <p className="text-[10px] text-amber-400/70 font-semibold uppercase">Student</p>
                      <p className="font-bold">{enrolledPass.studentName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-amber-400/70 font-semibold uppercase">Master Mentor</p>
                      <p className="font-bold truncate">{enrolledPass.instructor}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 text-[10px] text-amber-200/60 flex items-center justify-between">
                    <span>Issued: {enrolledPass.date}</span>
                    <span className="flex items-center gap-1 font-semibold text-[#D4A373]">
                      <ShieldCheck size={12} /> Guild Certified
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setEnrollCourse(null)}
                  className="w-full py-2.5 bg-[#BA5B55] hover:bg-[#a34d47] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Done & Return to Academy
                </button>
              </div>
            ) : (
              /* Enrollment Form */
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#BA5B55] bg-[#BA5B55]/10 px-2.5 py-0.5 rounded-full">
                  Masterclass Registration
                </span>
                <h3 className="text-xl font-bold text-gray-950 font-serif mt-2 leading-snug">
                  {enrollCourse.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Tuition: <strong className="text-gray-900">{formatPrice(enrollCourse.price)}</strong> • Mentored by {enrollCourse.instructor}
                </p>

                {errorMessage && (
                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl mt-3">{errorMessage}</p>
                )}

                <form onSubmit={handleEnrollSubmit} className="flex flex-col gap-3 mt-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Layla Al-Mansour"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#BA5B55]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      Email Address (for Course Portal & Labs)
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. layla@example.com"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#BA5B55]"
                    />
                  </div>

                  <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
                    Includes lifetime access to video labs, raw ingredient supply lists, and a physical signed certificate of completion.
                  </p>

                  <button
                    type="submit"
                    disabled={enrolling}
                    className="w-full py-3 bg-[#BA5B55] hover:bg-[#a34d47] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <BookOpen size={16} />
                    <span>{enrolling ? "Securing Seat..." : `Confirm Enrollment • ${formatPrice(enrollCourse.price)}`}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversitySection;
