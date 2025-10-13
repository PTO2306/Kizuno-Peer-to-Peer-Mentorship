import { Box } from '@mui/material';
import ListingCard from '../components/UI components/card/ListingCard';
import { useListing } from '../Data/ListingContext';

const MyListingPage = () => {
    const { userListings } = useListing();

    return (
        <Box
            className="w-full max-w-7xl"
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                },
                gap: 3,
                py: 4,
                width: "100%",
                mx: "auto",
                transition: 'opacity 0.2s ease-in-out',
            }}
        >
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