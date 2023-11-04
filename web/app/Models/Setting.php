<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    //use HasFactory;
	
	protected $table = 'settings';
	public $timestamps = true;
	
	protected $fillable = [
        'shop_id',
        'product_tag',
        'part_image',
        'mask_image',
        'text_font_size',
        'text_font_style',
        'text_max_length',
        'status',
		'created_at',
		'updated_at'
    ];
}
