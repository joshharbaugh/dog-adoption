# Fetch Dog Adoption Platform

A Next.js application that helps users find their perfect canine companion through Fetch's dog adoption API. Users can browse, search, and filter through available dogs, and get matched with their ideal furry friend.

## Features

- **Authentication**: Secure login system
- **Search & Filters**: 
  - Multi-select breed filtering
  - Age range filtering
  - Location-based search by city
  - Sort by breed or age
- **Favorites**: Save and manage favorite dogs
- **Matching**: Generate matches from favorited dogs
- **Pagination**: Browse through large sets of results efficiently

## Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: [radix-ui](https://www.radix-ui.com/)
- **Type Safety**: TypeScript

## Prerequisites

- Node.js 18.17 or later
- npm or yarn

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/joshharbaugh/dog-adoption.git
cd dog-adoption
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Login page
│   └── search/
│       ├── _components/ # Search page components
│       └── page.tsx     # Search page
├── components/
│   └── ui/             # ui components
├── hooks/
│   └── use-auth.ts     # Authentication hook
└── lib/
    ├── types.ts        # TypeScript interfaces
    └── api.ts          # API functions
```

## API Integration

The application integrates with Fetch's dog adoption API. Key endpoints used:

- `/auth/login` - User authentication
- `/dogs/breeds` - Fetch available breeds
- `/dogs/search` - Search dogs with filters
- `/dogs/match` - Generate matches
- `/locations/search` - Search locations

## Features in Detail

### Authentication
- Users must log in with name and email
- Session management using HTTP-only cookies
- Automatic redirection for unauthenticated users

### Dog Search
- Filter dogs by multiple breeds
- Search by city/location
- Filter by age range
- Sort results by breed or age
- Paginated results

### Location Search
- Search by city name
- Multiple location selection
- ZIP code based filtering

### Favorites & Matching
- Add/remove dogs from favorites
- Generate matches from favorite dogs
- View matched dog details

## Future Improvements

### Writing Tests
- Jest and React Testing Library
- End-to-end (BDD) tests (Playwright)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.