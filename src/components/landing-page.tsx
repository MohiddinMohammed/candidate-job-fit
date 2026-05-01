"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  "Upload resume",
  "Set preferences",
  "Discover jobs",
  "Analyze fit",
  "Apply smarter",
];

export function LandingPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-16">
      <header className="space-y-6 text-center">
        <Badge variant="secondary" className="mx-auto">
          Production-ready MVP
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
          Find jobs that actually match your resume.
        </h1>
        <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
          Upload resume → Set preferences → Discover jobs → Analyze fit → Apply
          smarter
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/dashboard?focus=resume">
            <Button size="lg">
              Upload Resume
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              View Demo Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <section className="mt-16 grid gap-4 md:grid-cols-5">
        {steps.map((step, index) => (
          <Card key={step} className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">
                Step {index + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-lg font-medium">{step}</CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <CardTitle>Smart matching, transparent scoring</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Each recommendation includes matched and missing skills, hard-filter
            results, and clear rationale so you can prioritize opportunities
            with confidence.
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <CardTitle>Privacy and compliance by design</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            The platform helps with discovery and evaluation. Applications
            happen on the original job page and users review generated materials
            before submission.
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
