// file: src/pages/Progress.jsx
import './progress.css';

export default function Progress(){
  return (
    <div className="progress-page">
      <h1>🌱 Site Progress Updates</h1>

      <div className="update">
        <div className="date">Sept 12, 2025 1:00 p.m. to 3:30 p.m.</div>
        <ul>
          <li>Added multiple article creation to Home Page</li>
          <li>Supported images and captions</li>
          <li>Updated Yaml and tested entries and updates</li>
          <li>Fixed state error - oops</li>
          <li>Tested PC, IoS, Android</li>
        </ul>
      </div>

      <div className="update">
        <div className="date">Sept 11, 2025 9:00 a.m. to 3:00 p.m.</div>
        <ul>
          <li>Removed left side navigation</li>
          <li>Adjusted slider to maintain aspect ratio and border with black background</li>
          <li>Added secondary navigation for page subheading jumps and added addition images for each heading</li>
          <li>Added buttons with paw prints to secondary navigation</li>
          <li>Reformated CMS to update new layouts</li>
          <li>Added book now and search functions (no logic yet)</li>
          <li>Recreated hamburger menu with book now button at the bottom for mobile ease of use.</li>
        </ul>
      </div>

      <div className="update">
        <div className="date">Sept 10, 2025 9:00 a.m. to 3:00 p.m.</div>
        <ul>
          <li>Tested CMS by adding photos and taglines to the slider</li>
          <li>Spoke with Justin about services and design</li>
          <li>Looked at Facebook to pull images</li>
          <li>Looked at current wrebsite to get basic info</li>
          <li>Removed Newsletter Form</li>
          <li>Created page for Services and successfully linked it to the CMS</li>
          <li>Researched layout CSS for tomorrows build (See below)</li>
        </ul>

        <section>
          <h2>Design Enhancements for Your Services Page</h2>

          <p>Here’s how we can make your Services page feel polished, trustworthy, and visually appealing:</p>

          <ol>
            <li>
              <h3>1. Add a Professional Header</h3>
              <p>Position your <strong>logo on the left</strong>, paired with site navigation in the center or right.</p>
              <p>Include a succinct tagline like: <em>“Caring Pet Boarding in Rapid City, MI”</em>.</p>
            </li>

            <li>
              <h3>2. Add a Footer</h3>
              <p>Include:</p>
              <ul>
                <li>Contact information (phone, email, address)</li>
                <li>Social media links or an email signup</li>
                <li>A small note like: <em>“© [Year] Meadow Ridge Pet Lodge — All rights reserved”</em></li>
              </ul>
            </li>

            <li>
              <h3>3. Structured Service Layout</h3>
              <p>Convert each service into visually styled <strong>cards</strong> featuring:</p>
              <ul>
                <li>A service image</li>
                <li>Title and short description</li>
                <li>Icon overlays or subtle border</li>
                <li>“<strong>Learn More</strong>” button</li>
              </ul>
            </li>

            <li>
              <h3>4. Grid-Based Visual Flow</h3>
              <p>Adopt a layout like:</p>
              <pre>
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
gap: 1rem;
              </pre>
              <p>Creates responsive, balanced service sections.</p>
            </li>

            <li>
              <h3>5. Use High-Quality Photos</h3>
              <p>
                Add real images of pets, facilities, or clients. Resources:
                {' '}
                <a href="https://muffingroup.com/blog/pet-care-website/" target="_blank" rel="noreferrer">Muffin Group</a>,
                {' '}
                <a href="https://www.gingrapp.com/blog/7-dog-boarding-website-tips-strategies-and-must-haves" target="_blank" rel="noreferrer">Gingrapp</a>
              </p>
            </li>

            <li>
              <h3>6. Add Storytelling Section (Optional)</h3>
              <p>Include a short “<strong>Why Choose Us</strong>” section highlighting mission, staff, or strengths.</p>
            </li>
          </ol>
        </section>
      </div>

      <div className="update">
        <div className="date">Sept 9, 2025 11:00 a.m. to 2:35 p.m.</div>
        <ul>
          <li>Added dynamic image slider with fallback support.</li>
          <li>Netlify CMS configured to allow owners to update homepage slider.</li>
          <li>Fallback image now shows when no images are available.</li>
          <li>Created Github access to CMS. Tested successfully.</li>
          <li>3.5 hours</li>
        </ul>
      </div>

      <div className="update">
        <div className="date">Aug 29, 2025</div>
        <ul>
          <li>Created homepage layout, carousel, and newsletter signup.</li>
          <li>Netlify CMS initialized and Git integration successful.</li>
        </ul>
      </div>
    </div>
  );
}
