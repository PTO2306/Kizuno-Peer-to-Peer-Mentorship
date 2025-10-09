import { useState } from 'react';
import { Box , Button, ButtonGroup, Typography, Paper} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ListingCard from '../components/UI components/card/ListingCard';

const exampleData = [{
avatar: '',
title: 'Developer interview practice',
mentor: 'Coding Jesus',
subtitle: 'Brush up on your interview skills with an experienced SWE',
desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lobortis ultrices felis, ac sodales purus cursus vel. Suspendisse vitae vestibulum odio. Integer sem dui, rutrum sit amet arcu vitae sed.',
skill: 'Beginner',
availability: 'Weekends',
mode: 'In Person'
},
{
avatar: '',
title: 'Insurance advice',
mentor: 'Chad Sharrock',
subtitle: 'Chat with an experienced and passionate insurance broker about your options',
desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lobortis ultrices felis, ac sodales purus cursus vel. Suspendisse vitae vestibulum odio. Integer sem dui, rutrum sit amet arcu vitae sed.',
skill: 'Intermediate',
availability: 'Weekdays',
mode: 'Hybrid'
},
{
avatar: '',
title: 'ADHD Coaching',
mentor: 'Natalia Berghoff',
subtitle: 'Happy to have a chat about ADHD and daily challenges!',
desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lobortis ultrices felis, ac sodales purus cursus vel. Suspendisse vitae vestibulum odio. Integer sem dui, rutrum sit amet arcu vitae sed.',
skill: 'Expert',
availability: 'Evenings',
mode: 'Online'
},
{
    avatar: '',
    title: 'Astronomy Hobby Advice',
    mentor: 'Tiago #DobsonianPower',
    subtitle: "My passion is astronomy and I'm happy to give anyone advice who wants to start stargazing",
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lobortis ultrices felis, ac sodales purus cursus vel. Suspendisse vitae vestibulum odio. Integer sem dui, rutrum sit amet arcu vitae sed.',
    skill: 'Advanced',
    availability: 'Mornings',
    mode: 'Online'
    }
]

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
    <>
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
            {exampleData.map((item, index) => (
                <ListingCard
                    key={`${item.title}-${index}`}
                    avatar={item.avatar}
                    title={item.title}
                    mentor={item.mentor}
                    subtitle={item.subtitle}
                    desc={item.desc}
                    skill={item.skill}
                    mode={item.mode}
                    availability={item.availability}
                />
            ))}
        </Box>
    </Box>
    </>
);
};

export default DashboardPage;