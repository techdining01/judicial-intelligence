/**
 * Team Page
 * Team management and collaboration features
 */

'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, Mail, Phone, Calendar, Shield } from 'lucide-react';

function JoinDate({ date }: { date: string }) {
  const [formattedDate, setFormattedDate] = useState('');
  
  useEffect(() => {
    setFormattedDate(new Date(date).toLocaleDateString());
  }, [date]);
  
  return (
    <p className="text-xs text-slate-500 mt-1">
      Joined {formattedDate}
    </p>
  );
}

export default function TeamPage() {
  const teamMembers = [
    {
      id: '1',
      name: 'Dr. Amina Bello',
      role: 'Senior Legal Researcher',
      email: 'amina.bello@judicial-ai.com',
      phone: '+234-802-123-4567',
      avatar: 'AB',
      status: 'active',
      joinedDate: '2023-01-15',
      specialization: 'Constitutional Law'
    },
    {
      id: '2',
      name: 'Prof. James Okoro',
      role: 'Legal AI Specialist',
      email: 'james.okoro@judicial-ai.com',
      phone: '+234-803-234-5678',
      avatar: 'JO',
      status: 'active',
      joinedDate: '2023-03-20',
      specialization: 'Contract Law'
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      role: 'Legal Analyst',
      email: 'sarah.johnson@judicial-ai.com',
      phone: '+234-804-345-6789',
      avatar: 'SJ',
      status: 'active',
      joinedDate: '2023-06-10',
      specialization: 'Criminal Law'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Team Management</h1>
            <p className="text-slate-600">Manage your legal research team and collaboration</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Invite Team Member
          </button>
        </div>

        {/* Team Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{teamMembers.length}</p>
                <p className="text-sm text-slate-600">Total Members</p>
              </div>
            </div>
          </div>
          
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {teamMembers.filter(m => m.status === 'active').length}
                </p>
                <p className="text-sm text-slate-600">Active Members</p>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">3</p>
                <p className="text-sm text-slate-600">Departments</p>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">12</p>
                <p className="text-sm text-slate-600">Pending Invites</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members List */}
        <div className="border border-slate-200 rounded-lg p-4 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Team Members</h3>
          </div>
          
          <div className="divide-y divide-slate-200">
            {teamMembers.map((member) => (
              <div key={member.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-slate-600">{member.avatar}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{member.name}</h4>
                      <p className="text-sm text-slate-600">{member.role}</p>
                      <p className="text-xs text-slate-500">{member.specialization}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                      <JoinDate date={member.joinedDate} />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-600 hover:text-slate-900 transition-colors">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-600 hover:text-slate-900 transition-colors">
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Departments */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Department Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-2">Constitutional Law</h4>
              <p className="text-sm text-slate-600 mb-3">Research and analysis of constitutional matters</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">1 member</span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Active</span>
              </div>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-2">Contract Law</h4>
              <p className="text-sm text-slate-600 mb-3">Contract drafting and dispute resolution</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">1 member</span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Active</span>
              </div>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-2">Criminal Law</h4>
              <p className="text-sm text-slate-600 mb-3">Criminal case analysis and legal support</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">1 member</span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
