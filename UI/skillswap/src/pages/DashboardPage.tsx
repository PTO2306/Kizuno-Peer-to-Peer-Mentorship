import React, { useState } from 'react';
import { Box , Button, ButtonGroup, Typography, Paper, Dialog, DialogTitle, DialogContent, IconButton} from '@mui/material';
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
    const [isFilterDialogOpen, setIsFilterDialogOpen] = React.useState(false);

    const handleOpenFilterDialog = () => {
        setIsFilterDialogOpen(true);
    };

    const handleCloseFilterDialog = () => {
        setIsFilterDialogOpen(false);
    };


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
            <Paper className="w-full max-w-7xl flex flex-col md:flex-row md:justify-between p-2 items-center gap-2">
                <Box className="hidden md:flex flex-grow-0 gap-1 overflow-x-auto w-full md:w-auto">
                    {categoryButtons}
                </Box>
                <Box className="flex items-center gap-4 w-full justify-center md:w-auto md:justify-end">
                    {/* Dashboard View Label */}
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        className="uppercase font-semibold mt-1 text-xs sm:text-sm align-middle" 
                    >
                        Dashboard View:
                    </Typography>

                    {/* View Selector Buttons */}
                    <ButtonGroup
                        variant="outlined"
                        aria-label="Dashboard View Selector"
                        className="flex-shrink-0"
                    >
                        <Button
                            variant={userType === "Learning" ? "contained" : "outlined"}
                            onClick={() => setUserType("Learning")}
                            className="text-xs sm:text-sm" 
                        >
                            Learning
                        </Button>
                        <Button
                            variant={userType === "Teaching" ? "contained" : "outlined"}
                            onClick={() => setUserType("Teaching")}
                            className="text-xs sm:text-sm" 
                        >
                            Teaching
                        </Button>
                    </ButtonGroup>
                    
                    {/* Filters Button */}
                    <Button
                        variant="contained"
                        startIcon={<FilterListIcon />}
                        size='small'
                        className="text-xs sm:text-sm" 
                        onClick={handleOpenFilterDialog}
                    >
                        Filters
                    </Button>
                </Box>

                {/* Filter Dialog */}
                <Dialog 
                    open={isFilterDialogOpen} 
                    onClose={handleCloseFilterDialog}
                    fullScreen
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDialog-container': {
                            '@media (min-width: 900px)': {
                                alignItems: 'flex-start',
                                paddingTop: '5vh',
                            },
                        },
                        '& .MuiDialog-paper': {
                            '@media (min-width: 900px)': {
                                maxWidth: '400px',
                                height: 'auto',
                                maxHeight: '80vh',
                                borderRadius: '8px',
                            },
                        },
                    }}
                >
                    <DialogTitle>
                        <Box className="flex justify-between items-center">
                            <Typography variant="h6">Filter Categories</Typography>
                            <IconButton onClick={handleCloseFilterDialog}>
                                <FilterListIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Box className="flex flex-wrap gap-2 justify-center">
                            {categoryButtons}
                        </Box>
                    </DialogContent>
                </Dialog>
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