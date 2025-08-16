import React, { useState, useEffect } from 'react';
import AdBanner from './AdBanner';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Progress } from './components/ui/progress';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Alert, AlertDescription } from './components/ui/alert';
import { 
  Download, 
  Video, 
  Music, 
  Smartphone, 
  Monitor, 
  Check, 
  AlertCircle, 
  Clock,
  Play,
  ExternalLink,
  Youtube,
  Instagram,
  Twitter,
  Facebook
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://backend-repo-production-7744.up.railway.app';

// Platform icon mapping
const getPlatformIcon = (platform) => {
  switch(platform?.toLowerCase()) {
    case 'youtube':
      return <Youtube className="w-4 h-4" />;
    case 'instagram':
      return <Instagram className="w-4 h-4" />;
    case 'twitter':
    case 'x':
      return <Twitter className="w-4 h-4" />;
    case 'facebook':
      return <Facebook className="w-4 h-4" />;
    case 'tiktok':
      return <Video className="w-4 h-4" />;
    default:
      return <Video className="w-4 h-4" />;
  }
};

// Platform detection
const detectPlatform = (url) => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('tiktok.com')) return 'TikTok';
  if (url.includes('instagram.com')) return 'Instagram';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter/X';
  if (url.includes('facebook.com')) return 'Facebook';
  return 'Unknown';
};

function App() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('best');
  const [format, setFormat] = useState('mp4');
  const [audioOnly, setAudioOnly] = useState(false);
  const [removeWatermark, setRemoveWatermark] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadId, setDownloadId] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState(null);
  const [error, setError] = useState('');
  const [supportedPlatforms, setSupportedPlatforms] = useState([]);

  // Fetch supported platforms on component mount
  useEffect(() => {
    const fetchSupportedPlatforms = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/supported-platforms`);
        setSupportedPlatforms(response.data.platforms);
      } catch (error) {
        console.error('Failed to fetch supported platforms:', error);
      }
    };

    fetchSupportedPlatforms();
  }, []);

  // Poll download status
  useEffect(() => {
    let interval;
    if (downloadId && (downloadStatus?.status === 'queued' || downloadStatus?.status === 'processing')) {
      interval = setInterval(async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/download/${downloadId}/status`);
          setDownloadStatus(response.data);
          
          if (response.data.status === 'completed' || response.data.status === 'failed') {
            setIsDownloading(false);
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Failed to fetch download status:', error);
          setError('Failed to fetch download status');
          setIsDownloading(false);
          clearInterval(interval);
        }
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [downloadId, downloadStatus?.status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDownloadStatus(null);
    setDownloadId(null);

    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setIsDownloading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/download`, {
        url: url.trim(),
        quality,
        format,
        audio_only: audioOnly,
        remove_watermark: removeWatermark
      });

      setDownloadId(response.data.download_id);
      setDownloadStatus(response.data);
    } catch (error) {
      console.error('Download failed:', error);
      setError(error.response?.data?.detail || 'Download failed. Please try again.');
      setIsDownloading(false);
    }
  };

  const handleDownloadFile = () => {
    if (downloadId && downloadStatus?.file_url) {
      window.open(`${API_BASE_URL}${downloadStatus.file_url}`, '_blank');
    }
  };

  const resetForm = () => {
    setUrl('');
    setDownloadId(null);
    setDownloadStatus(null);
    setError('');
    setIsDownloading(false);
  };

  const detectedPlatform = url ? detectPlatform(url) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ArslanVid</h1>
                <p className="text-purple-200 text-sm">Download videos without watermarks</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-purple-200">
              <Smartphone className="w-4 h-4" />
              <span>Mobile Friendly</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Card */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Multi-Platform Video Downloader
              </CardTitle>
              <CardDescription className="text-purple-200">
                Download videos from YouTube, TikTok, Instagram, and more - completely watermark-free!
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* URL Input Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-lg font-semibold">Video URL</Label>
                  <div className="relative">
                    <Input
                      id="url"
                      type="url"
                      placeholder="Paste your video URL here (YouTube, TikTok, Instagram, etc.)"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-purple-200 pr-20"
                      disabled={isDownloading}
                    />
                    {detectedPlatform && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                          {getPlatformIcon(detectedPlatform)}
                          <span className="ml-1">{detectedPlatform}</span>
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Options Tabs */}
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="bg-white/10 border-white/20">
                    <TabsTrigger value="basic" className="data-[state=active]:bg-purple-500">Basic</TabsTrigger>
                    <TabsTrigger value="advanced" className="data-[state=active]:bg-purple-500">Advanced</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quality">Quality</Label>
                        <Select value={quality} onValueChange={setQuality} disabled={isDownloading}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="best">Best Quality</SelectItem>
                            <SelectItem value="1080p">1080p HD</SelectItem>
                            <SelectItem value="720p">720p</SelectItem>
                            <SelectItem value="480p">480p</SelectItem>
                            <SelectItem value="worst">Fastest Download</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="format">Format</Label>
                        <Select value={format} onValueChange={setFormat} disabled={isDownloading}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mp4">MP4 (Recommended)</SelectItem>
                            <SelectItem value="webm">WEBM</SelectItem>
                            <SelectItem value="mkv">MKV</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Download Type</Label>
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant={!audioOnly ? "default" : "outline"}
                            onClick={() => setAudioOnly(false)}
                            className={!audioOnly ? "bg-purple-500 hover:bg-purple-600" : "border-white/20 text-white hover:bg-white/10"}
                            disabled={isDownloading}
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Video
                          </Button>
                          <Button
                            type="button"
                            variant={audioOnly ? "default" : "outline"}
                            onClick={() => setAudioOnly(true)}
                            className={audioOnly ? "bg-purple-500 hover:bg-purple-600" : "border-white/20 text-white hover:bg-white/10"}
                            disabled={isDownloading}
                          >
                            <Music className="w-4 h-4 mr-2" />
                            Audio
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                        <div>
                          <h3 className="font-semibold text-white">Remove Watermarks</h3>
                          <p className="text-sm text-purple-200">Automatically remove watermarks from TikTok and other platforms</p>
                        </div>
                        <Button
                          type="button"
                          variant={removeWatermark ? "default" : "outline"}
                          onClick={() => setRemoveWatermark(!removeWatermark)}
                          className={removeWatermark ? "bg-green-500 hover:bg-green-600" : "border-white/20 text-white hover:bg-white/10"}
                          disabled={isDownloading}
                        >
                          {removeWatermark ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Download Button */}
                <Button 
                  onClick={handleSubmit}
                  disabled={isDownloading || !url.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 text-lg"
                >
                  {isDownloading ? (
                    <>
                      <Clock className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Download Video
                    </>
                  )}
                </Button>
              </div>

              {/* Error Display */}
              {error && (
                <Alert className="bg-red-500/20 border-red-400/30 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Progress and Status */}
              {downloadStatus && (
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white">Download Status</h3>
                        <Badge 
                          variant={
                            downloadStatus.status === 'completed' ? 'default' : 
                            downloadStatus.status === 'failed' ? 'destructive' : 
                            'secondary'
                          }
                          className={
                            downloadStatus.status === 'completed' ? 'bg-green-500' :
                            downloadStatus.status === 'failed' ? 'bg-red-500' :
                            'bg-yellow-500'
                          }
                        >
                          {downloadStatus.status}
                        </Badge>
                      </div>

                      <p className="text-purple-200">{downloadStatus.message}</p>

                      {/* Progress Bar */}
                      {downloadStatus.progress && downloadStatus.status === 'processing' && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-purple-200">
                            <span>Progress: {downloadStatus.progress}</span>
                            {downloadStatus.speed && <span>Speed: {downloadStatus.speed}</span>}
                            {downloadStatus.eta && <span>ETA: {downloadStatus.eta}</span>}
                          </div>
                          <Progress 
                            value={parseFloat(downloadStatus.progress?.replace('%', '')) || 0} 
                            className="bg-white/10"
                          />
                        </div>
                      )}

                      {/* Download Complete */}
                      {downloadStatus.status === 'completed' && (
                        <div className="space-y-4">
                          <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4">
                            <div className="flex items-center space-x-2 text-green-200 mb-3">
                              <Check className="w-5 h-5" />
                              <span className="font-semibold">Download Completed!</span>
                            </div>
                            
                            {downloadStatus.metadata && (
                              <div className="space-y-2 text-sm text-green-100">
                                <p><strong>Title:</strong> {downloadStatus.metadata.title}</p>
                                <p><strong>Uploader:</strong> {downloadStatus.metadata.uploader}</p>
                                {downloadStatus.metadata.duration && (
                                  <p><strong>Duration:</strong> {Math.floor(downloadStatus.metadata.duration / 60)}:{String(downloadStatus.metadata.duration % 60).padStart(2, '0')}</p>
                                )}
                                <p><strong>File Size:</strong> {(downloadStatus.file_size / (1024 * 1024)).toFixed(2)} MB</p>
                                <p><strong>Platform:</strong> {downloadStatus.metadata.platform}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex space-x-3">
                            <Button 
                              onClick={handleDownloadFile}
                              className="bg-green-500 hover:bg-green-600 text-white flex-1"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download File
                            </Button>
                            <Button 
                              onClick={resetForm}
                              variant="outline"
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              Download Another
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Download Failed */}
                      {downloadStatus.status === 'failed' && (
                        <div className="space-y-3">
                          <Alert className="bg-red-500/20 border-red-400/30 text-red-200">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{downloadStatus.message}</AlertDescription>
                          </Alert>
                          <Button 
                            onClick={resetForm}
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            Try Again
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Supported Platforms */}
          <Card className="bg-white/5 backdrop-blur-lg border-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Play className="w-5 h-5 mr-2 text-purple-400" />
                Supported Platforms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {supportedPlatforms.map((platform, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-center space-x-3 mb-3">
                      {getPlatformIcon(platform.name)}
                      <h3 className="font-semibold">{platform.name}</h3>
                    </div>
                    <div className="space-y-1">
                      {platform.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30 mr-2 mb-1">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <AdBanner/>
      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-purple-200">
            <p className="text-sm">
              © 2025 ArslanVid - Download videos responsibly and respect creators' rights
            </p>
            <p className="myName">Made by Arslan</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;