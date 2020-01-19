<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Stats extends Model
{
    protected $guarded = [
        "ip",
        "city",
        "region",
        "country",
        "coords",
        "timezone",
        "user_id"
    ];
    
    public function user(){
        return $this->belongsTo("App\User",'user_id');
    }

}
