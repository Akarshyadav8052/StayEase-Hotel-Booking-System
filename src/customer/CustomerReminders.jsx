import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_SMS_REMINDER_API_URL || "http://localhost:3001";

function getCustomer() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(
    new Date(`${date}T00:00:00`)
  );
}

export default function CustomerReminders() {
  const accessToken = getCustomer()?.jwtToken;
  const [reminders, setReminders] = useState([]);
  const [bookingDate, setBookingDate] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(Boolean(accessToken));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const request = useCallback(async (path, options = {}) => {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Unable to process the reminder request.");
    }
    return result;
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return undefined;
    let cancelled = false;

    request("/api/reminders")
      .then((result) => {
        if (!cancelled) setReminders(result.reminders);
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, request]);

  async function createReminder(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const result = await request("/api/reminders", {
        method: "POST",
        body: JSON.stringify({ bookingDate, location, phoneNumber }),
      });
      setReminders((current) => [result.reminder, ...current]);
      setBookingDate("");
      setLocation("");
      setPhoneNumber("");
      setNotice("Your reminder is scheduled. We’ll text you at 9:00 AM on your check-in date.");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  if (!accessToken) {
    return (
      <main className="container py-5">
        <div className="alert alert-info">
          Please <Link to="/login">log in</Link> to create and view SMS reminders.
        </div>
      </main>
    );
  }

  const today = new Date().toLocaleDateString("en-CA");

  return (
    <main className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="h3 mb-2">SMS booking reminders</h1>
          <p className="text-muted mb-4">
            Add your check-in details and we’ll send a reminder text at 9:00 AM on that date.
          </p>

          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          {notice && <div className="alert alert-success" role="status">{notice}</div>}

          <form className="card card-body shadow-sm mb-4" onSubmit={createReminder}>
            <div className="mb-3">
              <label className="form-label" htmlFor="reminder-date">Check-in date</label>
              <input
                className="form-control"
                id="reminder-date"
                type="date"
                min={today}
                value={bookingDate}
                onChange={(event) => setBookingDate(event.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="reminder-location">Hotel location</label>
              <input
                className="form-control"
                id="reminder-location"
                type="text"
                maxLength="120"
                placeholder="Hotel name, city, or address"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="reminder-phone">Mobile number</label>
              <input
                className="form-control"
                id="reminder-phone"
                type="tel"
                autoComplete="tel"
                placeholder="+919876543210"
                pattern="^\+[1-9]\d{7,14}$"
                title="Use international format, for example +919876543210"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                required
              />
              <div className="form-text">Enter the number in international format, including country code.</div>
            </div>
            <button className="btn btn-primary align-self-start" type="submit" disabled={saving}>
              {saving ? "Scheduling..." : "Schedule SMS reminder"}
            </button>
          </form>

          <section aria-labelledby="reminders-heading">
            <h2 className="h5 mb-3" id="reminders-heading">Your reminder messages</h2>
            {loading && <p role="status">Loading reminders...</p>}
            {!loading && reminders.length === 0 && (
              <p className="text-muted">You don’t have any SMS reminders yet.</p>
            )}
            <div className="d-grid gap-3">
              {reminders.map((reminder) => (
                <article className="card shadow-sm" key={reminder.id}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                      <span className={`badge ${
                        reminder.status === "sent" ? "text-bg-success" :
                          reminder.status === "failed" ? "text-bg-danger" : "text-bg-primary"
                      }`}>
                        {reminder.status}
                      </span>
                      <small className="text-muted">
                        {reminder.status === "sent" ? "Sent" : "Scheduled"} for {formatDate(reminder.bookingDate)} at 9:00 AM
                      </small>
                    </div>
                    <p className="mb-1">{reminder.message}</p>
                    <small className="text-muted">To: {reminder.phoneNumber}</small>
                    {reminder.status === "failed" && reminder.errorMessage && (
                      <p className="text-danger small mb-0 mt-2">
                        Delivery failed: {reminder.errorMessage}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
