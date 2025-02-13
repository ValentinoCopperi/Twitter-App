import React from 'react'
import SearchBar from './_components/search-bar'
import ProfileCard from './_components/profile-card'

const ProfileBar = () => {
  return (
    <div className='px-8 py-6 space-y-3'>
        <ProfileCard/>
        <SearchBar/>
    </div>
  )
}

export default ProfileBar