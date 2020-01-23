<?php

namespace App\Policies;

use App\User;
use App\Videos;
use App\Roles;
use Illuminate\Auth\Access\HandlesAuthorization;

class VideoPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any videos.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function viewAny(User $user)
    {
        return $user->isAdmin() || $user->isMod() || $user->isUser();
    }

    /**
     * Determine whether the user can view the videos.
     *
     * @param  \App\User  $user
     * @param  \App\Videos  $videos
     * @return mixed
     */
    public function view(User $user, Videos $videos)
    {
        return $user->isAdmin() || $user->isMod() || $user->isUser();
    }

    /**
     * Determine whether the user can create videos.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->isAdmin() || $user->isMod() || $user->isUser();
    }

    /**
     * Determine whether the user can update the videos.
     *
     * @param  \App\User  $user
     * @param  \App\Videos  $videos
     * @return mixed
     */
    public function update(User $user, Videos $videos)
    {
        return $user->isAdmin() || $user->isMod() || $user->isUser() || $user->id===$videos->id;
    }

    /**
     * Determine whether the user can delete the videos.
     *
     * @param  \App\User  $user
     * @param  \App\Videos  $videos
     * @return mixed
     */
    public function delete(User $user, Videos $videos)
    {
        return $user->isAdmin() || $user->isMod() || $user->isUser() || $user->id===$videos->id;
    }

    /**
     * Determine whether the user can restore the videos.
     *
     * @param  \App\User  $user
     * @param  \App\Videos  $videos
     * @return mixed
     */
    public function restore(User $user, Videos $videos)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the videos.
     *
     * @param  \App\User  $user
     * @param  \App\Videos  $videos
     * @return mixed
     */
    public function forceDelete(User $user, Videos $videos)
    {
        //
    }
}
