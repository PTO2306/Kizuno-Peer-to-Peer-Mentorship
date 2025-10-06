import React, { useState } from 'react';
import { Box , Button, ButtonGroup, Typography, Paper} from '@mui/material';
import ClassCard from '../components/UI components/card/ClassCard';
import CardMedia from '../assets/skill-card-placeholder.jpg';
import CardMedia2 from '../assets/skill-card-placeholder2.jpg';
import CardMedia3 from '../assets/skill-card-placeholder3.jpg';
import FilterListIcon from '@mui/icons-material/FilterList';

// For later to have dynamic categories as filters
interface DashboardProps {
    catergoryData: string[]
}

const categoryData = ["All", "Coding", "Gardening", "Marketing", "Gaming", "Music"]

const DashboardPage = () => {
    const [category, setCategory] = useState("All")
    const [userType, setUserType] = useState("Learning")


    const categoryButtons = categoryData.map(cat => (
        <Button
            key={cat}
            variant={category === cat ? "contained" : "outlined"}
            onClick={() => setCategory(cat)}
            size="small"
            className='rounded-4xl'
        >
            {cat}
        </Button>
    ));

    return (
        <Box className="flex flex-col items-center w-full min-h-screen py-10 px-4">
            <Paper className="w-full max-w-7xl flex flex-col md:flex-row md:justify-between md:items-center p-2 items-center gap-2">
                <Box className="flex gap-2 overflow-x-auto">
                 {categoryButtons}
                </Box>
                <Box className="flex items-center gap-4">
                    <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        className="uppercase font-semibold mt-1"
                    >
                        Dashboard View:
                    </Typography>
    
                     
                        <ButtonGroup variant="outlined" aria-label="Dashboard View Selector">
                            <Button 
                                variant={userType === "Learning" ? "contained" : "outlined"} 
                                onClick={() => setUserType("Learning")}
                            >
                                Learning
                            </Button>
                            <Button 
                                variant={userType === "Teaching" ? "contained" : "outlined"} 
                                onClick={() => setUserType("Teaching")}
                            >
                                Teaching
                            </Button>
                        </ButtonGroup>
                        <Button
                            variant="contained"
                            startIcon={<FilterListIcon />}
                            size='small' 
                        >
                        Filters
                        </Button>
                </Box>
            </Paper>
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
            </Box>
        </Box>
    );
};

export default DashboardPage;