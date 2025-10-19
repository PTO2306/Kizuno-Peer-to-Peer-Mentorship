import { useState, useEffect, useRef, useCallback, useMemo, useTransition } from 'react';
import { Box, Button, ButtonGroup, Paper, TextField, CircularProgress, Typography, Skeleton } from '@mui/material';
import ListingCard from '../components/UI components/card/ListingCard';
import type { FetchListingsParams, SkillModel } from '../models/userModels';
import { useProfile } from '../Data/ProfileContext';
import { useListing } from '../Data/ListingContext';

const DashboardPage = () => {
  const [listingType, setListingType] = useState<'Mentor' | 'Mentee' | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const { profile } = useProfile();
  const { searchListings, fetchListings, loading: searchLoading } = useListing();

  const observer = useRef<IntersectionObserver | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const lastListingRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (searchLoading || isPending) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [searchLoading, hasMore]
  );

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const loadListings = async () => {
      const payload: FetchListingsParams = {
        page,
        pageSize: 9,
        search: debouncedSearch.trim(),
        tagNames: selectedTags,
        reset: page === 1,
      };

      if (listingType) {
        payload.type = listingType;
      }

      try {
        const response = await fetchListings(payload);
        if (!response.success) return;

        setHasMore(response.hasMore ?? false);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      }
    };

    loadListings();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [page, listingType, debouncedSearch, selectedTags]);

  useEffect(() => {
    setPage(1);
  }, [listingType, debouncedSearch, selectedTags]);

  const handleTypeToggle = useCallback((type: 'Mentor' | 'Mentee') => {
    startTransition(() => {
      setListingType((prev) => (prev === type ? null : type));
    });
  }, []);

  const handleTagToggle = useCallback((tagName: string) => {
    startTransition(() => {
      setSelectedTags((prev) =>
        prev.includes(tagName)
          ? prev.filter((t) => t !== tagName)
          : [...prev, tagName]
      );
    });
  }, []);

  const renderedListings = useMemo(() => {
    return searchListings.map((listing, index) => {
      const isLast = index === searchListings.length - 1;

      if (isLast && hasMore) {
        return (
          <div ref={lastListingRef} key={listing.id}>
            <ListingCard {...listing} />
          </div>
        );
      }
      return <ListingCard key={listing.id} {...listing} />;
    });
  }, [searchListings, lastListingRef, hasMore]);

  const showSkeleton = (searchLoading && page === 1) || isPending;

  return (
    <Box className="flex flex-col items-center w-full min-h-screen py-10 px-4">
      {/* Controls */}
      <Paper className="w-full max-w-7xl flex flex-col md:flex-row md:justify-between p-2 items-center gap-4">
        <TextField
          variant="outlined"
          placeholder="Search listings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: { xs: '100%', md: '300px' },
            '& .MuiInputBase-root': {
              height: '46px'
            }
          }}
        />

        <ButtonGroup sx={{ minWidth: { xs: '100%', md: '250px' } }}>
          <Button
            variant={listingType === 'Mentor' ? 'contained' : 'outlined'}
            onClick={() => handleTypeToggle('Mentor')}
            sx={{
              height: '46px',
              flex: 1
            }}
          >
            Learn
          </Button>
          <Button
            variant={listingType === 'Mentee' ? 'contained' : 'outlined'}
            color="secondary"
            onClick={() => handleTypeToggle('Mentee')}
            sx={{
              height: '46px',
              flex: 1
            }}
          >
            Teach
          </Button>
        </ButtonGroup>

        <Box className="flex flex-wrap gap-1 justify-center md:justify-end">
          {profile?.skills?.map((tag: SkillModel) => (
            <Button
              key={tag.name}
              size="small"
              variant={
                selectedTags.includes(tag.name) ? 'contained' : 'outlined'
              }
              color={tag.isTeaching ? 'primary' : 'secondary'}
              onClick={() => handleTagToggle(tag.name)}
              sx={{ height: '46px' }}
            >
              {tag.name}
            </Button>
          ))}
        </Box>
      </Paper>

      {/* Listings Grid */}
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
          opacity: isPending ? 0.6 : 1,
          transition: 'opacity 0.2s ease-in-out',
        }}
      >
        {showSkeleton ? (
          Array.from({ length: 9 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height={350}
              sx={{ borderRadius: 3 }}
            />
          ))
        ) : (
          renderedListings
        )}
      </Box>

      {searchLoading && page > 1 && <CircularProgress sx={{ my: 3 }} />}

      {
        !hasMore && !searchLoading && searchListings.length > 0 && (
          <Typography sx={{ color: 'text.secondary', mt: 3 }}>
            You've reached the end.
          </Typography>
        )
      }

      {
        !searchLoading && searchListings.length === 0 && (
          <Typography sx={{ color: 'text.secondary', mt: 3 }}>
            No listings found. Try adjusting your filters.
          </Typography>
        )
      }
    </Box >
  );
};

export default DashboardPage;