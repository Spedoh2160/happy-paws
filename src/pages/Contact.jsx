import { useCRM } from '../crm/CRMProvider.jsx';

export default function Contact() {
  const { data } = useCRM();
  return (
    <div>
      <h1 className="page-title">Contact</h1>

      <section id="contact" className="card" style={{marginTop:12}}>
        <h2 className="section-title">Contact Us</h2>
        <p className="muted">{data.contact.general}</p>
        <p><strong>Phone:</strong> {data.site.phone} &nbsp; • &nbsp; <strong>Email:</strong> <a href={`mailto:${data.site.email}`}>{data.site.email}</a></p>

        <form name="contact" method="POST" data-netlify="true" className="grid cols-2" style={{marginTop:12}}>
          <input type="hidden" name="form-name" value="contact"/>
          <input required name="name" placeholder="Your name"/>
          <input required type="email" name="email" placeholder="Email"/>
          <input name="phone" placeholder="Phone"/>
          <input name="dog" placeholder="Dog's name"/>
          <textarea name="message" placeholder="How can we help?" rows="4" style={{gridColumn:'1/-1'}}></textarea>
          <button className="cta" type="submit" style={{gridColumn:'1/-1'}}>Send</button>
        </form>
      </section>

      <section id="reservations" className="card" style={{marginTop:12}}>
        <h2 className="section-title">Reservations</h2>
        <p className="muted">{data.contact.reservations}</p>
        <form name="reservations" method="POST" data-netlify="true" className="grid cols-2" style={{marginTop:12}}>
          <input type="hidden" name="form-name" value="reservations"/>
          <input required name="name" placeholder="Your name"/>
          <input required type="email" name="email" placeholder="Email"/>
          <input name="dates" placeholder="Preferred dates"/>
          <select name="service" defaultValue="">
            <option value="" disabled>Service</option>
            {['Overnight Stays','Day Options','Grooming','Training'].map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <textarea name="notes" placeholder="Notes" rows="4" style={{gridColumn:'1/-1'}}></textarea>
          <button className="cta" type="submit" style={{gridColumn:'1/-1'}}>Request Booking</button>
        </form>
      </section>
    </div>
  );
}
