import { SideScrollCarousel } from '../components/Carousel';

export default function About() {
  return (
    <div className="min-h-[80vh]">
      <div className="bg-royal-blue text-snow w-full p-4 rounded-lg">
        <div className="w-full max-w-[800px] mx-auto">
          <h3 className="text-xl font-medium">About Ripple Records</h3>
          <p>
            Ripple records formerly spin trade marketplace was my final project
            during my time attending learningfuze coding bootcamp. After
            completing the program and landing my first developer position i
            have since revised my first project at learningfuze as well as
            building various other projects to continue learning and maintain my
            skills. Some of these projects include my portfolio website v1 and
            v2, and various mock business websites. During this time i somehow
            neglected my final project, so i have since dedicated my time to
            redesign and refactor the project maintaining the original premise,
            a marketplace for record collectors.
          </p>
        </div>
      </div>
      <div>
        <SideScrollCarousel
          data={favoriteAlbums}
          title="Some of my favorite albums"
        />
      </div>
    </div>
  );
}
const favoriteAlbums = [
  {
    title: 'My Beautiful Dark Twisted Fantasy',
    artist: 'Ye',
    year: '2010',
    genre: 'Rap',
    image: '/mbdtf.jpg',
  },
  {
    title: 'The Harvest',
    artist: 'Tribal Seeds',
    year: '2009',
    genre: 'Reggae',
    image: '/harvest.jpg',
  },
  {
    title: 'Peace of Mind',
    artist: 'Rebelution',
    year: '2012',
    genre: 'Reggae',
    image: '/peace.jpg',
  },
  {
    title: 'Man on the Moon: The End of Day',
    artist: 'Kid Cudi',
    year: '2009',
    genre: 'Rap',
    image: '/motm.jpg',
  },
  {
    title: 'K.I.D.S',
    artist: 'Mac Miller',
    year: '2010',
    genre: 'Rap',
    image: '/kicking.jpeg',
  },
];
