import { useEffect, useState } from 'react';
import { submitReport } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ReportForm() {
  const { isAuthenticated } = useAuth();
  const [incidentType, setIncidentType] = useState('Safety');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationLoading, setLocationLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setLocationLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocationLoading(false);
      },
      (geoError) => {
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError('Location permission denied. Please allow access to capture coordinates.');
        } else {
          setError('Unable to detect location. Please try again.');
        }
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    if (!file) {
      setImagePreview(null);
      return;
    }
    setImagePreview(URL.createObjectURL(file));
  };

  const readImageAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!locationName) {
      setError('Please enter a location name.');
      setLoading(false);
      return;
    }

    if (!latitude || !longitude) {
      setError('Unable to submit without GPS coordinates.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        incidentType,
        description,
        latitude: Number(latitude),
        longitude: Number(longitude),
        locationName,
      };

      if (imageFile) {
        payload.image = await readImageAsDataUrl(imageFile);
      }

      await submitReport(payload);
      setSuccess('Report submitted successfully.');
      setDescription('');
      setLocationName('');
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="card">
        <h2>Submit a Safety Report</h2>
        <p>You must be logged in to submit a report.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Report an Incident</h2>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Incident type
          <select value={incidentType} onChange={(e) => setIncidentType(e.target.value)}>
            <option value="Safety">Safety</option>
            <option value="Harassment">Harassment</option>
            <option value="Theft">Theft</option>
            <option value="Delay">Delay</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
            required
          />
        </label>

        <label>
          Location name
          <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="Station, stop or landmark"
            required
          />
        </label>

        <div>
          <p>Detected GPS coordinates:</p>
          {locationLoading ? (
            <p>Detecting coordinates...</p>
          ) : (
            <>
              <p>Latitude: {latitude || 'Unavailable'}</p>
              <p>Longitude: {longitude || 'Unavailable'}</p>
            </>
          )}
        </div>

        <label>
          Upload image (optional)
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {imagePreview && (
          <div style={{ marginTop: '1rem' }}>
            <img
              src={imagePreview}
              alt="Incident preview"
              style={{ width: '100%', maxWidth: '280px', borderRadius: '0.5rem' }}
            />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting report...' : 'Submit report'}
        </button>
      </form>
    </section>
  );
}
