import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Button, ButtonGroup, Paper, TextField, CircularProgress, Typography } from '@mui/material';
import ListingCard from '../components/UI components/card/ListingCard';
import type { ListingModel, SkillModel } from '../models/userModels';
import { useProfile } from '../Data/ProfileContext';
import { useListing } from '../Data/ListingContext';

const DashboardPage = () => {
  const [listingType, setListingType] = useState('Learning');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { profile } = useProfile();
  const { searchListings, fetchListings, loading } = useListing();

  const observer = useRef<IntersectionObserver | null>(null);

  const lastListingRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const loadListings = async () => {
      const response = await fetchListings({
        type: listingType === 'Learning' ? 'Mentor' : 'Mentee',
        page,
        pageSize: 10,
        search: search.trim(),
        tagNames: selectedTags,
        reset: page === 1,
      });

      if (!response.success) return;

      setHasMore(response.hasMore ?? false);
    };

    loadListings();
  }, [page, listingType, search, selectedTags]);

  useEffect(() => {
    setPage(1);
  }, [listingType, search, selectedTags]);


  return (
    <Box className="flex flex-col items-center w-full min-h-screen py-10 px-4">
      {/* Controls */}
      <Paper className="w-full max-w-7xl flex flex-col md:flex-row md:justify-between p-2 items-center gap-2">
        <TextField
          variant="outlined"
          placeholder="Search listings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { xs: '100%', md: '300px' } }}
        />

        <ButtonGroup variant="outlined" aria-label="View selector">
          <Button
            variant={listingType === 'Learning' ? 'contained' : 'outlined'}
            onClick={() => setListingType('Learning')}
          >
            Learning
          </Button>
          <Button
            variant={listingType === 'Teaching' ? 'contained' : 'outlined'}
            onClick={() => setListingType('Teaching')}
          >
            Teaching
          </Button>
        </ButtonGroup>

        {/* Optional: Profile tag filters */}
        <Box className="flex flex-wrap gap-1 justify-center md:justify-end">
          {profile?.skills?.map((tag: SkillModel) => (
            <Button
              key={tag.name}
              size="small"
              variant={
                selectedTags.includes(tag.name) ? 'contained' : 'outlined'
              }
              onClick={() =>
                setSelectedTags((prev) =>
                  prev.includes(tag.name)
                    ? prev.filter((t) => t !== tag.name)
                    : [...prev, tag.name]
                )
              }
            >
              {tag.name}
            </Button>
          ))}
        </Box>
      </Paper>

      {/* Listings Grid */}
      <Box className="flex flex-wrap gap-4 justify-between py-4 max-w-7xl w-full">
        {searchListings.map((listing, index) => {
          if (index === searchListings.length - 1) {
            return (
              <div ref={lastListingRef} key={listing.id}>
                <ListingCard {...listing} />
              </div>
            );
          }
          return <ListingCard key={listing.id} {...listing} />;
        })}
      </Box>

      {/* Loading Spinner */}
      {loading && <CircularProgress sx={{ my: 3 }} />}
      {!hasMore && !loading && searchListings.length > 0 && (
        <Typography sx={{ color: 'text.secondary', mt: 3 }}>
          You’ve reached the end.
        </Typography>
      )}
    </Box>
  );
};

export default DashboardPage;