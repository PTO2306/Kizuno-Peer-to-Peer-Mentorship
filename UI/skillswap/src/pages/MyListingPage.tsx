import { Box } from '@mui/material';
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

const MyListingPage = () => {

    return (
        <Box className="flex flex-col items-center w-full min-h-screen py-10 px-4">
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
                    availability={item.availability}
                    mode={item.mode}
                />
            ))}
            </Box>
        </Box>
    );
};

export default MyListingPage;