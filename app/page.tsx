"use client";

import { SearchBar } from "@/components/SearchBar";
import { CompactJobCard } from "@/components/CompactJobCard";
import { CompactResultCard } from "@/components/CompactResultCard";
import { CompactSchemeCard } from "@/components/CompactSchemeCard";
import { CompactAdmissionCard } from "@/components/CompactAdmissionCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, FileText, Award, GraduationCap } from "lucide-react";
import Link from "next/link";
import { detailedJobsData } from "@/lib/detailedData";
import { dummyResults, dummySchemes, dummyAdmissions } from "@/lib/data";

export default function HomePage() {
  const latestJobs = detailedJobsData.slice(0, 6);
  const latestResults = dummyResults.slice(0, 6);
  const latestSchemes = dummySchemes.slice(0, 6);
  const latestAdmissions = dummyAdmissions.slice(0, 6);

  return (
    <div className="flex flex-col">

      <main className="flex flex-1 flex-col py-6 sm:py-8 lg:py-10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Sarkari Results India
            </h1>
            <p className="mb-6 text-base text-gray-600 dark:text-gray-400 sm:text-lg">
              Latest Government Jobs, Results, Schemes & Admissions
            </p>
            <div className="mx-auto max-w-2xl">
              <SearchBar />
            </div>
          </div>

          <div className="space-y-8">
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1173d4]/10">
                    <Briefcase className="h-4 w-4 text-[#1173d4]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                    Latest Jobs
                  </h2>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  className="text-[#1173d4] hover:text-[#1173d4]/80"
                >
                  <Link href="/jobs">
                    View All
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {latestJobs.map((job) => (
                  <CompactJobCard
                    key={job.id}
                    id={job.id}
                    title={job.title}
                    department={job.department}
                    location={job.location}
                    lastDate={job.lastDate}
                  />
                ))}
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                    Latest Results
                  </h2>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  className="text-[#1173d4] hover:text-[#1173d4]/80"
                >
                  <Link href="/results">
                    View All
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {latestResults.map((result) => (
                  <CompactResultCard
                    key={result.id}
                    id={result.id}
                    title={result.title}
                    examName={result.examName}
                    resultDate={result.resultDate}
                  />
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                      <Award className="h-4 w-4 text-amber-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                      Government Schemes
                    </h2>
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    className="text-[#1173d4] hover:text-[#1173d4]/80"
                  >
                    <Link href="/schemes">
                      View All
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {latestSchemes.map((scheme) => (
                    <CompactSchemeCard
                      key={scheme.id}
                      id={scheme.id}
                      title={scheme.title}
                      department={scheme.department}
                      eligibility={scheme.eligibility}
                    />
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                      <GraduationCap className="h-4 w-4 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                      Admissions
                    </h2>
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    className="text-[#1173d4] hover:text-[#1173d4]/80"
                  >
                    <Link href="/admissions">
                      View All
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {latestAdmissions.map((admission) => (
                    <CompactAdmissionCard
                      key={admission.id}
                      id={admission.id}
                      institutionName={admission.institutionName}
                      programName={admission.programName}
                      applicationDeadline={admission.applicationDeadline}
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-gray-50 py-8 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/jobs" className="hover:text-[#1173d4]">Latest Jobs</Link></li>
                <li><Link href="/results" className="hover:text-[#1173d4]">Results</Link></li>
                <li><Link href="/admissions" className="hover:text-[#1173d4]">Admissions</Link></li>
                <li><Link href="/schemes" className="hover:text-[#1173d4]">Schemes</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                Categories
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-[#1173d4]">Banking</a></li>
                <li><a href="#" className="hover:text-[#1173d4]">Railways</a></li>
                <li><a href="#" className="hover:text-[#1173d4]">SSC</a></li>
                <li><a href="#" className="hover:text-[#1173d4]">UPSC</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                Resources
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-[#1173d4]">Syllabus</a></li>
                <li><a href="#" className="hover:text-[#1173d4]">Previous Papers</a></li>
                <li><a href="#" className="hover:text-[#1173d4]">Admit Cards</a></li>
                <li><a href="#" className="hover:text-[#1173d4]">Answer Keys</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                About
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-[#1173d4]">About Us</a></li>
                <li><a href="#" className="hover:text-[#1173d4]">Contact</a></li>
                <li><a href="#" className="hover:text-[#1173d4]">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#1173d4]">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 Sarkari Results India. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
