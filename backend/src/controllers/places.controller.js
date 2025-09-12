
import { ApiError } from "../utils/ApiError.js";
import { findPlaceId, getFirstPhotoUrlByPlaceId } from "../integrations/googlePlaces.client.js";

export const getPlaceImage = async (req, res) => {

  const { placeName } = req.body;

  if (!placeName) throw new ApiError(400, "Missing placeName parameter");

  // Step: 1 : Get Place ID 
  const placeId = await findPlaceId(placeName)
  if(!placeId) throw new ApiError(404, "No place found with that name")
  
  // Step 2: Get first photo URL
  const imageUrl = await getFirstPhotoUrlByPlaceId(placeId, 800)

  if (!imageUrl) throw new ApiError(404, "No photo reference found");

  res.json({ imageUrl });
};

export const getHotelImage = async ( req, res ) => {

  const { name, address } = req.body

  if( !name ) throw new ApiError(400, "Missing Hotel Name")
  if( !address ) throw new ApiError ( 400, "Missing Hotel Address")


  const query = `${name}, ${address}`;

  const placeId = await findPlaceId(query)
  if(!placeId) throw new ApiError( 404, "No Hotels found with name and address")
  
  const hotelImageUrl = await getFirstPhotoUrlByPlaceId( placeId, 800 )

  res.json({ hotelImageUrl });
}
