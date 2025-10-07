import { Box } from '@mui/material';
import ClassCard from '../components/UI components/card/ClassCard';
import CardMedia from '../assets/skill-card-placeholder.jpg';
import CardMedia2 from '../assets/skill-card-placeholder2.jpg';
import CardMedia3 from '../assets/skill-card-placeholder3.jpg';


const MyListingPage = () => {

    return (
        <Box className="flex flex-col items-center w-full min-h-screen py-10 px-4">
            <Box className = "flex flex-wrap gap-4 justify-between py-4 max-w-7xl">
                    <ClassCard
                        media={CardMedia}
                        title='Terrarium Workshop'
                        mentor='Michael Scott'
                        desc='Join our terrarium workshop!'
                        level='beginner'
                    />
                    <ClassCard
                        media={CardMedia2}
                        title='Dota 2 Coaching'
                        mentor='Liz Mouton'
                        desc='Coaching for position 4'
                        level='intermediate'
                    />
                    <ClassCard
                        media={CardMedia3}
                        title='Frontend Developer Support'
                        mentor='Chanel Brits'
                        desc='Get support from a senior frontend dev'
                        level='advanced'
                    />
                    <ClassCard
                        media={CardMedia}
                        title='Terrarium Workshop'
                        mentor='Michael Scott'
                        desc='Join our terrarium workshop!'
                        level='beginner'
                    />
                    <ClassCard
                        media={CardMedia2}
                        title='Dota 2 Coaching'
                        mentor='Liz Mouton'
                        desc='Coaching for position 4'
                        level='intermediate'
                    />
                    <ClassCard
                        media={CardMedia3}
                        title='Frontend Developer Support'
                        mentor='Chanel Brits'
                        desc='Get support from a senior frontend dev'
                        level='advanced'
                    />
                    <ClassCard
                        media={CardMedia}
                        title='Terrarium Workshop'
                        mentor='Michael Scott'
                        desc='Join our terrarium workshop!'
                        level='beginner'
                    />
                    <ClassCard
                        media={CardMedia2}
                        title='Dota 2 Coaching'
                        mentor='Liz Mouton'
                        desc='Coaching for position 4'
                        level='intermediate'
                    />
            </Box>
        </Box>
    );
};

export default MyListingPage;