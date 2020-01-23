<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Roles;
use App\Videos;

class User extends Authenticatable implements MustVerifyEmail
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', "avatar"
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function videos(){
        return $this->belongsTo("App\Videos","id");
    }

    public function role(){
        return $this->belongsTo("App\Roles", "role_id");
    }

    public function isAdmin()
    {
        $user = User::find(auth()->user()->id);
        $role = $user->role()->first()->name;

        if($role==="administrator"){
            return true;
        }
        else{
            return false;
        }
        
    }

    public function isMod()
    {
        $user = User::find(auth()->user()->id);
        $role = $user->role()->first()->name;

        if($role==="moderator"){
            return true;
        }
        else{
            return false;
        }
        
    }

    public function isUser()
    {
        $user = User::find(auth()->user()->id);
        $role = $user->role()->first()->name;

        if($role==="user"){
            return true;
        }
        else{
            return false;
        }
        
    }

}
