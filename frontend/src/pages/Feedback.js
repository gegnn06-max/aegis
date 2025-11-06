import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from '../hooks/use-toast';
import { Star, MessageSquare, Send } from 'lucide-react';

const Feedback = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    comments: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please provide a rating',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.comments.trim()) {
      toast({
        title: 'Comments required',
        description: 'Please provide your feedback',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);

    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
      const token = localStorage.getItem('token');

      // Include user info if available
      const feedbackData = {
        ...formData,
        username: user?.username || formData.name || 'Anonymous',
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`${BACKEND_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify(feedbackData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      await response.json();
      
      toast({
        title: 'Feedback submitted',
        description: 'Thank you for your feedback!',
        variant: 'success'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        rating: 0,
        comments: ''
      });
      setSubmitting(false);
    } catch (error) {
      console.error('Feedback error:', error);
      setSubmitting(false);
      toast({
        title: 'Submission failed',
        description: error.message || 'An error occurred',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
      
      <Navbar />
      
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center space-x-3">
            <MessageSquare className="w-10 h-10 text-cyan-400" />
            <span>Feedback</span>
          </h1>
          <p className="text-slate-400">Help us improve the fraud detection platform</p>
        </div>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Submit Your Feedback</CardTitle>
            <CardDescription className="text-slate-400">
              We value your opinion and suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">
                    Name <span className="text-slate-500">(optional)</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">
                    Email <span className="text-slate-500">(optional)</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Rating *</Label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-all duration-200 hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`w-10 h-10 transition-colors ${
                          star <= (hoveredRating || formData.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  {formData.rating > 0 && (
                    <span className="ml-4 text-sm text-slate-400">
                      {formData.rating} star{formData.rating > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comments" className="text-slate-300">
                  Comments *
                </Label>
                <Textarea
                  id="comments"
                  name="comments"
                  placeholder="Share your thoughts about the platform..."
                  value={formData.comments}
                  onChange={handleChange}
                  rows={6}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-6 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40 hover:scale-[1.02]"
              >
                {submitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-900/30 border-slate-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">99.2%</div>
                <p className="text-sm text-slate-400">Detection Accuracy</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/30 border-slate-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">10k+</div>
                <p className="text-sm text-slate-400">Reviews Analyzed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/30 border-slate-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">500+</div>
                <p className="text-sm text-slate-400">Active Users</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
