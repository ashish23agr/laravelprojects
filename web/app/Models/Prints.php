<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prints extends Model
{
    //use HasFactory;
	
	protected $table = 'prints';
	public $timestamps = true;
	
	protected $fillable = [
        'setting_id',
		'shop_id',
        'name',
        'short_code',
        'layer_content',
		'created_at',
		'updated_at'
    ];
}
