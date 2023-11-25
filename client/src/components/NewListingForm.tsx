import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Genre = {
  genreId: number;
  name: string;
};

export function NewListingForm() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState<string>();

  const navigate = useNavigate();
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    try {
      const formData = new FormData(event.currentTarget);
      console.log(formData);
      event.preventDefault();
      const response = await fetch('/api/create-listing', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const result = await response.json();
      console.log('Success:', result);
      navigate('/ProductPage');
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    console.log(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  function handleImageUpload(event) {
    if (!event) throw new Error('No image file');
    setSelectedFile(event.target.files[0]);
  }

  useEffect(() => {
    async function getGenres() {
      try {
        const res = await fetch('/api/get-genres');
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const result = await res.json();
        setGenres(result);
      } catch (error) {
        console.error(error);
      }
    }
    getGenres();
  }, []);

  function handleCancelClick() {
    setPreview('');
    setSelectedFile(undefined);
  }

  return (
    <div className="bg-[#E9EBED] min-h-screen p-4 text-lg">
      <h3 className="flex justify-center text-4xl underline">
        Create New Lisitng
      </h3>
      <form onSubmit={handleSubmit} className="max-w-screen-md mx-auto mt-8">
        <div className="flex flex-col ">
          {/* Image Input */}
          <div className="mb-4 ">
            <label className="block mb-2 font-bold  ">Image:</label>
            <input
              type="file"
              id="file-upload"
              name="image"
              onChange={handleImageUpload}
              accept="image/*"
              className="mb-2 cursor-pointer"
            />
            {selectedFile && (
              <img src={preview} alt="Uploaded" className="max-w-xs" />
            )}
          </div>

          {/* Artist and Album Name */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4">
            <div>
              <label className="block mb-2 font-bold ">Artist:</label>
              <input
                type="text"
                id="artist"
                name="artist"
                className="w-full mb-4 p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="album" className="block mb-2 font-bold">
                Album:
              </label>
              <input
                type="text"
                id="album"
                name="album"
                className="w-full mb-4 p-2 border rounded"
                required
              />
            </div>
          </div>

          {/* Genre, Condition, and Price */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-4">
            <div>
              <label className="block mb-2 font-bold">Genre:</label>
              <select
                id="genre"
                name="genre"
                className="w-full p-2 border rounded"
                required>
                {genres.map((genre) => (
                  <option key={genre.genreId} value={genre.genreId}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-bold">Condition:</label>
              <select
                id="condition"
                name="condition"
                className="w-full p-2 border rounded"
                required>
                <option>Mint (M)</option>
                <option>Near Mint (NM)</option>
                <option>Excellent (E)</option>
                <option>Very Good Plus (VG+)</option>
                <option>Very Good (VG)</option>
                <option>Good (G)</option>
                <option>Poor (P)</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-bold">Price ($):</label>

              <input
                type="text"
                id="price"
                name="price"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block mb-2 font-bold">Description:</label>
            <textarea
              id="info"
              name="about"
              defaultValue={''}
              rows={4}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Cancel and Submit Buttons */}
          <div className="mb-4 flex flex-col justify-between md:flex-row">
            <button
              type="reset"
              onClick={handleCancelClick}
              className="bg-gray-500 text-white p-2 rounded mb-2 md:mb-0 md:mr-2 hover:bg-gray-700 focus:outline-none focus:shadow-outline-gray active:bg-gray-800">
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800">
              Post Listing
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
