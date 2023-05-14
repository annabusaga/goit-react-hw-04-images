import { useState, useEffect } from 'react';
import { getImages } from 'service/apiPixabay';
import Searchbar from '../Searchbar/Searchbar';
import ImageGallery from '../ImageGallery/ImageGallery';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';
import Modal from '../Modal/Modal';
// import css from './App.module.css';
import Loader from 'components/Loader/Loader';
import Button from 'components/Button/Button';
import { setSelectionRange } from '@testing-library/user-event/dist/utils';

const App = () => {
  const [image, setImage] = useState([]);
  const [value, setValue] = useState('');
  const [page, setPage] = useState(1);
  const [isOpenModal, setisOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState(null);
  const [tags, setTags] = useState('');
  const [isLoadMoreShow, setIsLoadMoreShow] = useState(false);

  const onSubmit = value => {
    setValue(value);
    setImage([]);
    setPage(1);
  };

  const loadMoreClick = () => {
    setPage(prev => prev + 1);
  };

  const imageOnClick = ({ largeImageURL, tags }) => {
    setLargeImageURL(largeImageURL);
    setTags(tags);

    setisOpenModal(!isOpenModal);
  };

  const modalOnClick = () => {
    setLargeImageURL(null);
    setTags('');

    setisOpenModal(false);
  };

  const makeNormalizedImages = array => {
    return array.map(({ id, webformatURL, largeImageURL, tags }) => ({
      id,
      webformatURL,
      largeImageURL,
      tags,
    }));
  };

  useEffect(() => {
    if (!value) {
      return;
    }

    setIsLoading(true);
    async function fetchImages() {
      try {
        const {
          data: { hits, totalHits },
        } = await getImages({
          value,
          page,
        });
        if (hits.length) {
          setIsLoadMoreShow(page !== Math.ceil(totalHits / 12));
          setImage(prev => [...prev, ...makeNormalizedImages(hits)]);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchImages();
  }, [value, page]);

  return (
    <div>
      <Searchbar onSubmit={onSubmit} />
      {image.length !== 0 && (
        <>
          <ImageGallery>
            {image.map(({ id, webformatURL, largeImageURL, tags }) => (
              <ImageGalleryItem
                onClick={imageOnClick}
                key={id}
                webformatURL={webformatURL}
                largeImageURL={largeImageURL}
                tags={tags}
              />
            ))}
          </ImageGallery>
          {isLoadMoreShow && !isLoading && (
            <Button loadMoreClick={loadMoreClick} />
          )}
        </>
      )}
      {isOpenModal && (
        <Modal
          modalOnClick={modalOnClick}
          tags={tags}
          largeImageURL={largeImageURL}
        />
      )}
      {isLoading && <Loader />}
    </div>
  );
};

export default App;
