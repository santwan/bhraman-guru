import React from 'react'
import { useState } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import Input from '../../components/Input.jsx';
import { SelectBudgetOptions, SelectTravelList } from '../../constants/option.jsx';

function CreateTrip() {
    const [place,setPlace] = useState();

    const [formData,setFormData]=useState([]);

    const [openDailog,setOpenDailog]=useState(false);

    const [loading,setLoading] = useState(false);

    const handleInputChange = (name,value) => {

        if(name == 'noOfDays' && value>15){
            toast("Please enter Trip days Less than 15")
        }
    
        setFormData({
            ...formData,
            [name]:value
        })
    }
    
    useEffect(()=>{
        console.log(formData);
    },[formData])
    
    const login=useGoogleLogin({
        onSuccess:(codeResponse)=>GetUserProfile(codeResponse),
        onError:(error)=>console.log(error)
    })
    

    const onGenerateTrip = async () => {

        if(!formData?.noOfDays || !formData?.location||!formData?.budget||!formData?.traveler)
            {   
                toast("Please Fill all the details")
                if(formData.noOfDays>15)
                    {
                        toast("Enter Travel Days less than 15")
                    }
                return;
            }
    
        const user=localStorage.getItem('user');
    
        if(!user)
        {   
            setOpenDailog(true)
            return;
        }
    
        setLoading(true);
        
        const FINAL_PROMPT=AI_PROMPT
        .replace('{location}',formData?.location?.label)
        .replace('{noOfDays}',formData?.noOfDays)
        .replace('{traveler}',formData?.traveler)
        .replace('{budget}',formData?.budget)
        .replace('{noOfDays}',formData?.noOfDays)
    
        // console.log(FINAL_PROMPT);
    
        const result=await chatSession.sendMessage(FINAL_PROMPT);
    
        console.log("--",result?.response?.text());
        setLoading(false);
        SaveAiTrip(result?.response?.text());
      }

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10'>
        <h2 className='text-3xl font-sans font-bold mb-3'>Tell us your Travel preferences</h2>
        <p className='max-w-fit'>Just provide Some Basic information, and our trip planner will generate a customized itinerary based on your preferences</p>

        <div className='mt-10'>
            <div>
                <h2 className='font-semibold mb-2'>
                    What is Destination of choice?
                </h2>
                <GooglePlacesAutocomplete 
                    apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                    selectProps={{
                        place,
                        onChange: (v) => { setPlace(v); handleInputChange("location"), v },
                        placeholder: "Search your destination...",
                        isClearable: true
                    }}
                />
            </div>


            <div className="mt-10">
                <h2 className='font-semibold mb-2'>
                    How many days are you planning for?
                </h2>
                <Input 
                    placeholder="Ex.3" 
                    type="number" 
                    onChange={(e)=>handleInputChange('noOfDays', e.target.value)} 
                />
            </div>


            <div className='mt-10'>
            <h2 className='font-semibold mb-0'>What is Your Budget?</h2>
            <h3 className='font-normal mb-2'>The Budget is exclusively allocated for activities and dining purpose</h3>
            <div className='grid grid-cols-3 gap-3'>
            {SelectBudgetOptions.map((item, index) => {
                const Icon = item.icon;
                return (
                    <div
                    key = {index}
                    onClick = { () => handleInputChange('budget', item.title)} 
                    className = {`
                            p-2 border cursor-pointer rounded-lg hover:shadow-lg
                            ${ formData?.budget == item.title && 'shadow-lg border-black' }
                        `}
                    >
                    <Icon className="w-8 h-8 text-red-600" />
                    <h2 className="font-medium">{item.title}</h2>
                    <h2 className="text-xs text-gray-500">{item.desc}</h2>
                    </div>
                );
                })}
            </div>

            <div className='mt-10'>
                <h2 className='font-semibold mb-2'>
                    Who do you plan on traveling with on your next adventure?
                </h2>
                <div className='grid grid-cols-3 gap-2'>
                    {SelectTravelList.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div
                        key={index}
                        onClick={() => handleInputChange('traveler', item.people)}
                        className={`
                            p-2 border cursor-pointer rounded-lg hover:shadow-lg
                            ${formData?.traveler == item.people && 'shadow-lg border-black'}
                        `}>
    
                        <Icon className='w-8 h-8 text-indigo-600 mb-1' />
                        <h2 className='font-medium'>{item.title}</h2>
                        <h2 className='text-xs text-gray-500'>{item.desc}</h2>
                        <h2 className=' text-gray-900'>{item.people}</h2>
                        </div>
                    );
                    })}
                </div>
            </div>


            <div className='mt-10 text-right'>
                <Button onClick={onGenerateTrip} disabled={loading}>
                    {loading?
                    <AiOutlineLoading3Quarters className='h-10 w-10 animate-spin'/>: 'Generate Trip'}
                </Button>
            </div>
        </div>
        </div>
    </div>
  )
}

export default CreateTrip