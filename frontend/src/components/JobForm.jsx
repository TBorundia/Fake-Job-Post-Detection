import { useState } from 'react';
import axios from 'axios';
import Tesseract from 'tesseract.js';
import { FiUpload } from 'react-icons/fi';

const JobForm = ({ setJobData, setLoading, setError }) => {
  const [url, setUrl] = useState('');
  const [jobPost, setJobPost] = useState('');
  const [showPlatformInput, setShowPlatformInput] = useState(false);
  const [platform, setPlatform] = useState('');
  const [extractingText, setExtractingText] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/analyze', {
        url: url || null,
        job_post: jobPost || null,
        platform: platform || null
      });
      setJobData(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred while analyzing the job posting');
    } finally {
      setLoading(false);
    }
  };

  const handleTextareaClick = () => {
    setShowPlatformInput(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setExtractingText(true);
    try {
      const { data: { text } } = await Tesseract.recognize(
        file,
        'eng',
        { logger: m => console.log(m) }
      );
      setJobPost(text);
      setShowPlatformInput(true);
    } catch (error) {
      console.error('OCR Error:', error);
      setError('Failed to extract text from image');
    } finally {
      setExtractingText(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="url">Enter Job URL or paste a job post</label>
          <input
            id="url"
            type="text"
            placeholder="Enter job posting URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="form-group">
          <textarea
            id="jobPost"
            placeholder="Paste job posting content here"
            value={jobPost}
            onChange={(e) => setJobPost(e.target.value)}
            onClick={handleTextareaClick}
          />
        </div>

        <div
  className="form-group file-upload"
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
    margin: '8px 0',
    marginBottom:'0px',
    fontSize: '1px',
    fontFamily: 'Segoe UI, sans-serif',
    color: '#333',
  }}
>
  <label
    htmlFor="imageUpload"
    className="upload-label"
    style={{
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      padding: '4px 10px',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '1px solid #ddd',
      fontWeight: '300',
    }}
    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
  >
    <FiUpload size={16} style={{ marginRight: '6px', color: '#555' }} />
    Upload Job Image (JPG/PNG)
  </label>
  <input
    id="imageUpload"
    type="file"
    accept="image/jpeg, image/png"
    onChange={handleImageUpload}
    style={{ display: 'none' }}
  />
  {extractingText && (
    <p style={{ fontStyle: 'italic', fontSize: '10px', color: '#888' }}>
      Extracting text from image...
    </p>
  )}
</div>


        {showPlatformInput && (
          <div className='platform-input'>
            <label htmlFor="platform">Job Platform: </label>
            <input
              id="platform"
              type="text"
              placeholder="Enter job platform (LinkedIn, Indeed, etc.)"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            />
          </div>
        )}

        <button type="submit" className="submit-button">
          Analyze Job
        </button>
      </form>
    </div>
  );
};

export default JobForm;
