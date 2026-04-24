import './About.css';
import Emmanuel from '../../../assets/Emmanuel.webp';
import Kalilwa from '../../../assets/Kalilwa.webp';
import karagi from '../../../assets/karagi.webp';
import Arthur from '../../../assets/Arthur.webp';
import benjamin from '../../../assets/benjamin.webp';
import elie from '../../../assets/elie.webp';
import Eliana from '../../../assets/Eliana.webp';

const teamMembers = [
  { name: 'G.K Emmanuel', image: Emmanuel },
  { name: 'JF Kalilwa', image: Kalilwa },
  { name: 'B.M Karagi', image: karagi },
  { name: 'M. Arthur', image: Arthur },
  { name: 'N. Benjamin', image: benjamin },
  { name: 'K. Elie', image: elie },
  { name: 'L. Eliana', image: Eliana },
];

function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-heading">
      <div className="about__container">
        <div className="about__content">
          <h2 id="about-heading" className="about__title">
            À propos
          </h2>
          <div className="about__description">
            <p>
              Lisanga est une plateforme développée par <strong>M-Nuru Tech</strong> dans le but de connecter les talents Universitaires congolais du numérique et de promouvoir l'innovation technologique sur le continent. Permettant aux étudiants de présenter leurs projets, de collaborer avec d'autres passionnés et de trouver des opportunités professionnelles, Lisanga vise à créer une communauté dynamique et inclusive autour du numérique en RDC.
            </p>
            <p>
              <strong>M-Nuru Tech</strong>, une initiative portée par de jeunes étudiants congolais animés par une passion profonde pour l’informatique et les technologies. Plus qu’une simple structure, M-Nuru Tech incarne une vision : celle d’apporter de la lumière là où les défis persistent. Le mot Nuru, qui signifie « lumière », reflète pleinement leur philosophie — éclairer les problématiques du monde industriel et du quotidien par des solutions innovantes, intelligentes et accessibles.
            </p>

          </div>
        </div>

        <div className="about__team">
          <h3 className="about__team-title">M-Nuru Tech</h3>
          <div className="about__team-grid">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="about__team-member"
                style={{ '--index': index }}
              >
                <div className="about__team-image-wrapper">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="about__team-image"
                    loading="lazy"
                  />
                </div>
                <span className="about__team-name">{member.name}</span>
              </div>
            ))}
          </div>
          <p>Les jeunes chills qui n’aiment pas l’ambiance, seulement la science avec aisance.</p>
        </div>
      </div>
    </section>
  );
}

export default About;