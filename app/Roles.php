<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;

class Roles extends Model
{
    
    public function user(){
        return $this->belongsToMany(User::class);
    }

}
