import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import bg from "../../assets/images/bg.jpg";
import tidyHall from "../../assets/images/tidyHall.jpg";
import modern_lux from "../../assets/images/modern_lux.jpg";
import bhk3_apart from "../../assets/images/3BHKapartament.jpg";
import modern_pent from "../../assets/images/modern_pent.jpg";
import quite_house from "../../assets/images/quite_house.jpg";
import bhk4villa from "../../assets/images/4bhkvilla.jpg";
const sampleSaleListingss = [
  {
    name: "Luxurious 2 BHK Flat",
    description:
      "A premium 2-bedroom flat with modern amenities and a city skyline view.",
    address: "500 Skyline Towers, Mumbai, MH",
    regularPrice: 850000,
    discountPrice: 820000,
    bathrooms: 2,
    bedrooms: 2,
    parking: true,
    type: "rent",
    offer: false,
    imageUrls: [tidyHall, "luxurious2.jpg"],
    furnished: "Yes",
    userRef: "user555",
  },
];
let sampleOfferListings = [
  {
    name: "Luxury 3BHK Apartment",
    description:
      "Spacious and luxurious 3BHK apartment in the heart of the city.",
    address: "123 Central Park, City Center",
    regularPrice: 10000000,
    discountPrice: 9500000,
    bathrooms: 3,
    bedrooms: 3,
    parking: true,
    type: "sale",
    offer: true,
    imageUrls: [bhk3_apart],
    furnished: "furnished",
    userRef: "user123",
  },
  {
    name: "Cozy 1BHK Apartment",
    description: "Comfortable 1BHK apartment with all modern amenities.",
    address: "456 Riverside Drive, Suburbia",
    regularPrice: 4000000,
    discountPrice: 3800000,
    bathrooms: 1,
    bedrooms: 1,
    parking: false,
    type: "sale",
    offer: true,
    imageUrls: [tidyHall],
    furnished: "semi-furnished",
    userRef: "user456",
  },
  {
    name: "2BHK Apartment with Sea View",
    description: "Modern 2BHK apartment offering a spectacular sea view.",
    address: "789 Beach Road, Coastal Area",
    regularPrice: 6000000,
    discountPrice: 5800000,
    bathrooms: 2,
    bedrooms: 2,
    parking: true,
    type: "rent",
    offer: true,
    imageUrls: [modern_lux],
    furnished: "furnished",
    userRef: "user789",
  },
];

let sampleSaleListings = [
  {
    name: "Modern 3BHK Penthouse",
    description: "Penthouse with a great view, in a prime location.",
    address: "102 Sky High Towers, City Center",
    regularPrice: 12000000,
    discountPrice: null,
    bathrooms: 3,
    bedrooms: 3,
    parking: true,
    type: "sale",
    offer: false,
    imageUrls: [modern_pent],
    furnished: "furnished",
    userRef: "user654",
  },
  {
    name: "2BHK Flat in a Quiet Area",
    description: "2BHK flat perfect for a small family or couples.",
    address: "34 Rose Street, Quiet Suburb",
    regularPrice: 5000000,
    discountPrice: null,
    bathrooms: 2,
    bedrooms: 2,
    parking: true,
    type: "sale",
    offer: false,
    imageUrls: [quite_house],
    furnished: "semi-furnished",
    userRef: "user432",
  },
  {
    name: "Luxury 4BHK Villa",
    description: "A high-end 4BHK villa in an upscale neighborhood.",
    address: "50 Hillside View, Elite Estates",
    regularPrice: 17000000,
    discountPrice: null,
    bathrooms: 4,
    bedrooms: 4,
    parking: true,
    type: "sale",
    offer: false,
    imageUrls: [bhk4villa],
    furnished: "fully-furnished",
    userRef: "user321",
  },
];

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  const fetchOfferListings = async () => {
    try {
      const res = await fetch("/api/listing/get?offer=true&limit=4");
      const data = await res.json();
      console.log(data);
      setOfferListings(data);
      // fetchRentListings();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRentListings = async () => {
    try {
      const res = await fetch("/api/listing/get?type=rent&limit=4");
      const data = await res.json();
      console.log(data);
      setRentListings(data);
      // fetchSaleListings();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSaleListings = async () => {
    try {
      const res = await fetch("/api/listing/get?type=sale&limit=4");
      const data = await res.json();
      console.log(data);
      setSaleListings(data);
    } catch (error) {
      log(error);
    }
  };

  useEffect(() => {
    fetchOfferListings();
    fetchSaleListings();
    fetchRentListings();
  }, []);

  return (
    <div>
      {/* top */}
      <div className="flex px-3 max-w-6xl mx-auto space-x-10">
        <div className="space-y-10  basis-[60%] flex flex-col items-start pt-32">
          <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
            Elevate Your <span className="text-yellow-300">Lifestyle</span>
            <br />
            with Elite Properties.
          </h1>
          <div className="text-gray-400 text-xs sm:text-sm">
            Welcome to EliteEstate, where your dream home awaits!
            <br />
            Browse through our wide array of exquisite properties, <br /> each
            designed to meet your unique needs and preferences
          </div>
          <Link
            to={"/search"}
            className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
          >
            Let's get started...
          </Link>
        </div>
        <div className="basis-[40%] pt-5 flex">
          <img
            src={bg}
            className="rounded-lg h-[85%] opacity-80 outline outline-yellow-200/20 outline-offset-0 outline-[0px] object-cover"
            alt=""
          />
        </div>
      </div>

      <Swiper
        navigation={true} // Enable navigation buttons
        spaceBetween={50}
        slidesPerView={1}
        autoplay={{ delay: 3000 }} // Add autoplay with a 3-second delay
        modules={[Navigation, Autoplay]} // Attach the modules correctly
      >
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <img
                src={listing.imageUrls[0]}
                alt="Listing"
                className="h-[550px] w-full object-cover"
                onError={(e) => {
                  e.target.src = "fallback-image-url.jpg"; // Fallback image
                }}
              />
            </SwiperSlide>
          ))}
      </Swiper>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="space-y-8">
            <div className="my-3 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                className=" text-blue-800 hover:underline text-xl"
                to={"/search?type=rent"}
              >
                See all{">"}
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="space-y-8">
            <div className="my-3 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recently added places for rent
              </h2>
              <Link
                className=" text-blue-800 hover:underline text-xl"
                to={"/search?type=rent"}
              >
                See all{">"}
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="space-y-8">
            <div className="my-3 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recently added places for sale
              </h2>
              <Link
                className=" text-blue-800 hover:underline  text-xl"
                to={"/search?type=sale"}
              >
                See all{">"}
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
