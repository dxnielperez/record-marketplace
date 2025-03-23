import { FormEvent, useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type Genre = {
  genreId: number;
  name: string;
};

type Product = {
  recordId?: string;
  artist?: string;
  albumName?: string;
  genre?: string;
  condition?: string;
  price?: number;
  info?: string;
  images?: string[];
};

export function NewListingForm() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const location = useLocation();
  const product = location.state as Product | undefined;
  const [previews, setPreviews] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [genreValue, setGenreValue] = useState(product?.genre || '');
  const [conditionValue, setConditionValue] = useState(
    product?.condition || ''
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewURLs = useRef<string[]>([]);
  const originalFiles = useRef<(File | null)[]>([null, null, null, null]);

  const navigate = useNavigate();

  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      const initialPreviews: (string | null)[] = [null, null, null, null];
      const initialFiles: (File | null)[] = [null, null, null, null];

      const fetchImages = async () => {
        try {
          const fetchPromises = (product.images as string[])
            .slice(0, 4)
            .map(async (url, index) => {
              const response = await fetch(url);
              if (!response.ok)
                throw new Error(`Failed to fetch image: ${url}`);
              const blob = await response.blob();
              const file = new File([blob], `image-${index}.jpg`, {
                type: blob.type,
              });
              initialFiles[index] = file;
              initialPreviews[index] = url;
            });

          await Promise.all(fetchPromises);
          originalFiles.current = initialFiles;
          setPreviews(initialPreviews);
        } catch (error) {
          console.error('Failed to fetch original images:', error);
        }
      };

      fetchImages();
    }
  }, [product?.images]);

  useEffect(() => {
    previewURLs.current.forEach((url) => URL.revokeObjectURL(url));
    previewURLs.current = [];

    const newPreviews: (string | null)[] = [null, null, null, null];
    selectedFiles.forEach((file, index) => {
      if (file) {
        const url = URL.createObjectURL(file);
        previewURLs.current.push(url);
        newPreviews[index] = url;
      } else {
        newPreviews[index] =
          product?.images && index < product.images.length
            ? product.images[index]
            : null;
      }
    });

    setPreviews(newPreviews);

    return () => {
      previewURLs.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles, product?.images]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      const formData = new FormData();
      const form = event.currentTarget;
      formData.append('artist', form.artist.value);
      formData.append('album', form.album.value);
      formData.append('genre', genreValue);
      formData.append('condition', conditionValue);
      formData.append('price', form.price.value);
      formData.append('info', form.info.value);

      const filesToSubmit = selectedFiles.map(
        (file, index) => file || originalFiles.current[index]
      );
      filesToSubmit.forEach((file) => {
        if (file) {
          formData.append('images', file);
        }
      });

      if (!product) {
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

  function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    const newFiles = [...selectedFiles];
    newFiles[index] = file;
    setSelectedFiles(newFiles);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleSquareClick(index: number) {
    if (fileInputRef.current) {
      fileInputRef.current.click();
      fileInputRef.current.onchange = (e) => handleImageUpload(e as any, index);
    }
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
    setSelectedFiles([null, null, null, null]);
    if (product?.images) {
      const initialPreviews: (string | null)[] = [null, null, null, null];
      product.images.slice(0, 4).forEach((image, index) => {
        initialPreviews[index] = image;
      });
      setPreviews(initialPreviews);
    } else {
      setPreviews([null, null, null, null]);
    }
  }

  return (
    <div className="min-h-screen flex flex-col max-w-max mx-auto">
      <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-4 max-w-[1200px] mx-auto w-full">
        <div className="max-w-full lg:w-[600px] w-[520px]">
          <h1 className="pb-4">
            {product ? 'Edit Listing' : 'Create New Listing'}
          </h1>
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="w-full h-full aspect-square border border-black rounded-md flex items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200"
                onClick={() => handleSquareClick(index)}>
                {previews[index] ? (
                  <img
                    src={previews[index]!}
                    alt={`Preview ${index + 1}`}
                    className="object-cover rounded-md"
                  />
                ) : (
                  <span className="text-gray-500 text-sm text-center">
                    Click to add image
                  </span>
                )}
              </div>
            ))}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        <div className="max-w-[620px] w-full flex flex-col">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h3>Listing Information</h3>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                defaultValue={product?.artist}
                id="artist"
                name="artist"
                placeholder="Artist"
                className="border border-black rounded-md p-2"
                required
              />
              <input
                type="text"
                defaultValue={product?.albumName}
                id="album"
                name="album"
                placeholder="Album"
                className="border border-black rounded-md p-2"
                required
              />
              <div className="flex gap-2">
                <select
                  id="genre"
                  name="genre"
                  value={genreValue}
                  onChange={(e) => setGenreValue(e.target.value)}
                  className="border border-black rounded-md p-2 w-full"
                  required>
                  <option value="">Select a genre</option>
                  {genres.map((genre) => (
                    <option key={genre.genreId} value={genre.name}>
                      {genre.name}
                    </option>
                  ))}
                </select>
                <select
                  id="condition"
                  name="condition"
                  value={conditionValue}
                  onChange={(e) => setConditionValue(e.target.value)}
                  className="border border-black rounded-md p-2 w-full"
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
              <input
                type="number"
                step="0.01"
                defaultValue={product?.price}
                id="price"
                name="price"
                placeholder="Price ($)"
                className="border border-black rounded-md p-2"
                required
              />
              <textarea
                id="info"
                name="info"
                defaultValue={product?.info}
                rows={4}
                placeholder="Description"
                className="border border-black rounded-md p-2"
              />
            </div>
            <div className="flex justify-between gap-4 mt-0 md:mt-5">
              <button
                type="reset"
                onClick={handleCancelClick}
                className="w-min whitespace-nowrap text-center px-4 py-[6px] border border-black rounded-md hover:text-snow bg-gray-300">
                Cancel
              </button>
              <button
                type="submit"
                className="w-min whitespace-nowrap text-center px-4 py-[6px] border border-black rounded-md hover:text-snow bg-emerald">
                {product ? 'Update Listing' : 'Post Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
