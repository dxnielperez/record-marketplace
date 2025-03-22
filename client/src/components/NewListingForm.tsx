import { FormEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type Genre = {
  genreId: number;
  name: string;
};

export function NewListingForm() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Array for multiple files
  const product = useLocation().state; // Existing product data for editing
  const [previews, setPreviews] = useState<string[]>([]); // Array for multiple previews
  // State for controlled select inputs
  const [genreValue, setGenreValue] = useState(product?.genre || '');
  const [conditionValue, setConditionValue] = useState(
    product?.condition || ''
  );

  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();

      // Create a new FormData object manually
      const formData = new FormData();

      // Append form fields manually
      const form = event.currentTarget;
      formData.append('artist', form.artist.value);
      formData.append('album', form.album.value);
      formData.append('genre', genreValue);
      formData.append('condition', conditionValue);
      formData.append('price', form.price.value);
      formData.append('info', form.info.value);

      // Append all selected files under 'images'
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      if (!product) {
        // Create new listing
        const response = await fetch('/api/create-listing', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        await response.json();
      } else {
        // Update existing listing
        await fetch(`/api/update-listing/${product.recordId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });
      }
      navigate('/shop');
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (selectedFiles.length === 0) {
      setPreviews(product?.imageSrc ? [product.imageSrc] : []);
      return;
    }
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [selectedFiles, product?.imageSrc]);

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      throw new Error('No image files selected');
    }
    const filesArray = Array.from(event.target.files).slice(0, 4);
    setSelectedFiles(filesArray);
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
    setPreviews([]);
    setSelectedFiles([]);
  }

  return (
    <div className="min-h-screen p-4 text-lg">
      <h3 className="flex justify-center text-4xl underline">
        {product ? 'Edit Listing' : 'Create New Listing'}
      </h3>
      <form onSubmit={handleSubmit} className="max-w-screen-md mx-auto mt-8">
        <div className="flex flex-col">
          {/* Image Input */}
          <div className="mb-4">
            <label className="block mb-2 font-bold">Images (up to 4):</label>
            <input
              type="file"
              id="file-upload"
              name="images"
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="mb-2 cursor-pointer"
            />
            {previews.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {previews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="max-w-xs"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Artist and Album Name */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4">
            <div>
              <label className="block mb-2 font-bold">Artist:</label>
              <input
                type="text"
                defaultValue={product?.artist}
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
                defaultValue={product?.albumName}
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
                value={genreValue} // Controlled
                onChange={(e) => setGenreValue(e.target.value)}
                className="w-full p-2 border rounded"
                required>
                <option value="">Select a genre</option>
                {genres.map((genre) => (
                  <option key={genre.genreId} value={genre.name}>
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
                value={conditionValue} // Controlled
                onChange={(e) => setConditionValue(e.target.value)}
                className="w-full p-2 border rounded"
                required>
                <option value="">Select condition</option>
                <option value="Mint">Mint (M)</option>
                <option value="Near Mint">Near Mint (NM)</option>
                <option value="Excellent">Excellent (E)</option>
                <option value="Very Good Plus">Very Good Plus (VG+)</option>
                <option value="Very Good">Very Good (VG)</option>
                <option value="Good">Good (G)</option>
                <option value="Poor">Poor (P)</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-bold">Price ($):</label>
              <input
                type="number"
                step="0.01"
                defaultValue={product?.price}
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
              name="info"
              defaultValue={product?.info}
              rows={3}
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
              {product ? 'Update Listing' : 'Post Listing'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
