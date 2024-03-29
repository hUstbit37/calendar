<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table = 'events';
    protected $fillable = ['user_id', 'name', 'details', 'start', 'end', 'color'];
}