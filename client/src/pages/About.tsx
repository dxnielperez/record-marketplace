import { SideScrollCarouselv2 } from '../components/Carouselv2';

export default function About() {
  return (
    <div className="min-h-[80vh] max-w-5xl mx-auto">
      <div className="bg-royal-blue text-snow w-full px-4 py-4 lg:py-8 rounded-lg">
        <div className="w-full max-w-[800px] mx-auto">
          <h3 className="text-xl font-medium">About Ripple Records</h3>
          <p className="text-sm">
            Ripple Records is a conceptual marketplace for record collectors,
            where users can buy, sell, and trade vinyl records within a
            community-driven environment. Originally created as my final
            assignment at LearningFuze coding bootcamp, it has since been
            redesigned and refactored to improve functionality and user
            experience. Note that it is not an actual product.
          </p>
        </div>
      </div>
      <div>
        <SideScrollCarouselv2
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
    image: '/albums/mbdtf.jpg',
  },
  {
    title: 'The Harvest',
    artist: 'Tribal Seeds',
    year: '2009',
    genre: 'Reggae',
    image: '/albums/harvest.jpg',
  },
  {
    title: 'Peace of Mind',
    artist: 'Rebelution',
    year: '2012',
    genre: 'Reggae',
    image: '/albums/peace.jpg',
  },
  {
    title: 'Man on the Moon: The End of Day',
    artist: 'Kid Cudi',
    year: '2009',
    genre: 'Rap',
    image: '/albums/motm.jpg',
  },
  {
    title: 'K.I.D.S',
    artist: 'Mac Miller',
    year: '2010',
    genre: 'Rap',
    image: '/albums/kicking.jpeg',
  },
];
