import { Link } from 'react-router-dom';
import { typeOfCardList } from '../../utils';
import OfferList from '../../components/offer-list/offer-list';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { AppRoute } from '../../const';
import { Header } from '../../components/header/header';
import { getOffers } from '../../store/offers-data/selectors';
import { getFavoriteOffersId } from '../../store/favorite-process/selectors';
import { changeCity } from '../../store/common-data/common-data';
import { redirectToRoute } from '../../store/action';


function FavoritesScreen(): JSX.Element {
  const favoritesOffersId = useAppSelector(getFavoriteOffersId);
  const favoriteOffers = useAppSelector(getOffers).filter((offer) => favoritesOffersId.includes(offer.id));
  const favoriteOffersCitiesSet = new Set(favoriteOffers.map((of) => of.city.name));
  const favoriteOffersCities = Array.from(favoriteOffersCitiesSet);
  const dispatch = useAppDispatch();

  const handleCityClick = (city: string) => {
    dispatch(changeCity(city));
    dispatch(redirectToRoute(AppRoute.Main));
  }

  return (
    <div className="page">
      <Header />
      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            <ul className="favorites__list">
              {favoriteOffersCities.map((city) => (
                <li className="favorites__locations-items" key={city}>
                  <div className="favorites__locations locations locations--current">
                    <div className="locations__item">
                      <a className="locations__item-link" onClick={() => handleCityClick(city)}>
                        <span>{city}</span>
                      </a>
                    </div>
                  </div>
                  <OfferList offers={favoriteOffers.filter((o) => o.city.name === city)} listType={typeOfCardList.favourites} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <footer className="footer container">
        <Link to={AppRoute.Main} className="header__logo-link">
          <img className="footer__logo" src="img/logo.svg" alt="6 cities logo" width="64" height="33" />
        </Link>
      </footer>
    </div>
  );
}
export default FavoritesScreen;
