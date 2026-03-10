"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Scale, Video, FileText, Bell, TrendingUp, Clock, Award, Play } from "lucide-react";

export default function DashboardHomePage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    completedSimulations: 12,
    averageScore: 85,
    newJudgments: 3,
    upcomingHearings: 2
  });

  const dashboardCards = [
    {
      id: 1,
      title: "Legal Research",
      description: "Search statutes, regulations, and court judgments",
      icon: Search,
      color: "blue",
      features: ["Advanced search", "Quick stats", "Legal database"],
      buttonText: "Search Judgments",
      route: "/dashboard/research",
      stats: {
        label: "Database Size",
        value: "50K+ Documents"
      }
    },
    {
      id: 2,
      title: "AI Moot Court",
      description: "Practice legal arguments with AI judges",
      icon: Scale,
      color: "purple",
      features: [`${stats.completedSimulations} simulations`, `${stats.averageScore}% avg score`, "Multiple scenarios"],
      buttonText: "Start Simulation",
      route: "/dashboard/moot-court",
      stats: {
        label: "Completed",
        value: stats.completedSimulations
      }
    },
    {
      id: 3,
      title: "AI Courtroom Video",
      description: "Interactive video courtroom simulations",
      icon: Video,
      color: "green",
      features: ["3 scenarios available", "AI judge video", "Real-time scoring"],
      buttonText: "Start Video Interaction",
      route: "/dashboard/ai-courtroom",
      stats: {
        label: "Scenarios",
        value: "3 Active"
      }
    },
    {
      id: 4,
      title: "Legal Drafting AI",
      description: "Generate legal documents with AI assistance",
      icon: FileText,
      color: "orange",
      features: ["Generate Motion", "Generate Affidavit", "Generate Written Address"],
      buttonText: "Start Drafting",
      route: "/dashboard/legal-drafting",
      stats: {
        label: "Templates",
        value: "15+ Available"
      }
    },
    {
      id: 5,
      title: "Alerts",
      description: "Stay updated with legal notifications",
      icon: Bell,
      color: "red",
      features: [`${stats.newJudgments} new judgments`, `${stats.upcomingHearings} upcoming hearings`, "Real-time updates"],
      buttonText: "View All Alerts",
      route: "/dashboard/alerts",
      stats: {
        label: "New Items",
        value: stats.newJudgments + stats.upcomingHearings
      }
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: "",
        border: "border-blue-200",
        icon: "text-blue-600",
        button: "bg-blue-600 hover:bg-blue-700",
        badge: "bg-blue-100 text-blue-800"
      },
      purple: {
        bg: "",
        border: "border-purple-200",
        icon: "text-purple-600",
        button: "bg-purple-600 hover:bg-purple-700",
        badge: "bg-purple-100 text-purple-800"
      },
      green: {
        bg: "",
        border: "border-green-200",
        icon: "text-green-600",
        button: "bg-green-600 hover:bg-green-700",
        badge: "bg-green-100 text-green-800"
      },
      orange: {
        bg: "",
        border: "border-orange-200",
        icon: "text-orange-600",
        button: "bg-orange-600 hover:bg-orange-700",
        badge: "bg-orange-100 text-orange-800"
      },
      red: {
        bg: "",
        border: "border-red-200",
        icon: "text-red-600",
        button: "bg-red-600 hover:bg-red-700",
        badge: "bg-red-100 text-red-800"
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Legal Intel Dashboard</h1>
        <p className="text-slate-600 mt-2">Your unified legal intelligence platform</p>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card) => {
          const colors = getColorClasses(card.color);
          const Icon = card.icon;

          return (
            <div
              key={card.id}
              className={`${colors.bg} ${colors.border} border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg border ${colors.border}`}>
                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{card.description}</p>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2 mb-4">
                {card.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                    {feature}
                  </div>
                ))}
              </div>

              {/* Stats Badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}>
                  {card.stats.label}: {card.stats.value}
                </span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => router.push(card.route)}
                className={`w-full ${colors.button} text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2`}
              >
                {card.buttonText}
                {card.id === 2 && <Play className="h-4 w-4" />}
                {card.id === 3 && <Play className="h-4 w-4" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick Stats Overview */}
      <div className="border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Platform Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.completedSimulations}</div>
            <div className="text-sm text-slate-600">Completed Simulations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.averageScore}%</div>
            <div className="text-sm text-slate-600">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-slate-600">Active Scenarios</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">15+</div>
            <div className="text-sm text-slate-600">Document Templates</div>
          </div>
        </div>
      </div>
    </div>
  );
}
