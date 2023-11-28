import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
type Genre = {
  genreId: number;
  name: string;
};
export function CreateNewListing() {
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
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      console.log('formdata2', formData);
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
    <div className="sm:font-[10px]">
      <div className="flex min-h-full items-center justify-center create-listing-bg mobile-friendly">
        <div className="w-full max-w-lg mobile-listing">
          <div className="bg-white rounded-2xl max-w-3xl mx-auto w-full pl-9 pr-9 pt-9 pb-9 mt-8 mobile-friendly">
            <h2 className="text-center text-4xl font-bold leading-9 tracking-tight text-gray-900 mobile-create">
              Create new listing
            </h2>
            <form className="mobile-form" onSubmit={handleSubmit}>
              <div className="space-y-12">
                <div className="border-b border-gray-900/10">
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mobile-form">
                    <div className="col-span-full">
                      <label className="block font-medium leading-6 text-gray-900">
                        Add image
                      </label>
                      <div className="mt-2 max-h-40 flex justify-center rounded-lg border border-dashed border-gray-900/25">
                        {selectedFile && <img src={preview}></img>}
                        <div className="text-center">
                          <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                              {!selectedFile && <span>Upload a file</span>}
                              <input
                                onChange={handleImageUpload}
                                id="file-upload"
                                name="image"
                                type="file"
                                className="sr-only"
                              />
                            </label>
                            {!selectedFile && (
                              <p className="pl-1">or drag and drop</p>
                            )}
                          </div>
                          {!selectedFile && (
                            <p className="text-xs leading-5 text-gray-600">
                              PNG, JPG, GIF up to 2MB
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-900/10 pb-12">
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label className="block font-medium leading-6 text-gray-900">
                        Artist
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="artist"
                          id="artist"
                          className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block font-medium leading-6 text-gray-900">
                        Album
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="album"
                          id="album"
                          className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-medium leading-6 text-gray-900">
                        Genre
                      </label>
                      <div className="mt-2">
                        <select
                          id="genre"
                          name="genre"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                          {genres.map((genre) => (
                            <option key={genre.genreId} value={genre.genreId}>
                              {genre.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-medium leading-6 text-gray-900">
                        Condition
                      </label>
                      <div className="mt-2">
                        <select
                          id="condition"
                          name="condition"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                          <option>Mint (M)</option>
                          <option>Near Mint (NM)</option>
                          <option>Excellent (E)</option>
                          <option>Very Good Plus (VG+)</option>
                          <option>Very Good (VG)</option>
                          <option>Good (G)</option>
                          <option>Poor (P)</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-medium leading-6 text-gray-900">
                        Price
                      </label>

                      <div className="mt-2 flex items-center">
                        <h3 className="mr-1">$</h3>
                        <input
                          type="text"
                          name="price"
                          id="price"
                          className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="col-span-full">
                      <label className="block font-medium leading-6 text-gray-900">
                        Additional info
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="info"
                          name="about"
                          rows={3}
                          className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          defaultValue={''}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-x-6">
                <button
                  onClick={handleCancelClick}
                  type="reset"
                  className="text-sm font-semibold leading-6 hover:underline text-gray-900">
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Post listing
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
