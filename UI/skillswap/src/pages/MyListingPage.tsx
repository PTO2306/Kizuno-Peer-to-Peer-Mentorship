import { Box } from '@mui/material';
import ListingCard from '../components/UI components/card/ListingCard';
import { useListing } from '../Data/ListingContext';

const MyListingPage = () => {
    const { userListings } = useListing();

    return (
        <Box className="flex flex-wrap w-full py-10 px-4">
            {userListings.map((item, index) => (
                <ListingCard
                    key={index}
                    {...item}
                />
            ))}
        </Box>
    );
};

export default MyListingPage;