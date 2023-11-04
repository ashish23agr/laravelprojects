<?php
namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use App\Models\Session;
use App\Models\Prints;
use Illuminate\Support\Facades\DB;

class SettingController extends Controller
{	
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $settings = Setting::all();
		return response()->json(['status' => 200, 'settings'=>$settings]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {	
		$prints = array();
		$jsonData = $request->json()->all();
		$prints = $jsonData['fields'];
		
		unset($jsonData['fields']);
		
		$Setting = Setting::create($jsonData);
		
		if($Setting->id && count($prints) > 0){
			foreach ($prints as $print){
				$print['shop_id'] = $jsonData['shop_id'];
				$print['setting_id'] = $Setting->id;
				Prints::create($print);
			}
		}
		
		if($Setting){
			return response()->json(['message' => 'Data saved successfully']);
		}else{
			return response()->json(['message' => 'Something went wrong!']);
		}
    }

    
	
	/**
     * Display the specified resource.
     *
     * @param  \App\Models\Setting  $setting
     * @return \Illuminate\Http\Response
     */
    public function show(Setting $setting,$id)
    {
      $settings = Setting::find($id);
	  $prints = Prints::where('setting_id', $id)->get();
      return response()->json(['status' => 200, 'settings'=>$settings, 'prints'=>$prints]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Setting  $setting
     * @return \Illuminate\Http\Response
     */
	 
	 public function edit(Request $request, $id)
    {	
		$prints = array();
		$jsonData = $request->json()->all();
		unset($jsonData['created_at']);
		unset($jsonData['updated_at']);
		if($jsonData['fields'] && count($jsonData['fields']) > 0){
			$prints = $jsonData['fields'];
			unset($jsonData['fields']);
		}
		$data = Setting::where('id',$id)->update($jsonData);
		
		if($id && count($prints) > 0){
			Prints::where('setting_id', $id)->delete();
			foreach ($prints as $print){
				$print['shop_id'] = $jsonData['shop_id'];
				$print['setting_id'] = $id;
				Prints::create($print);
			}
		}
		
		return response()->json(['message' => 'Data updated successfully']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Setting  $setting
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        Setting::where('id', $id)->delete();
		return response()->json(['message' => 'Data removed successfully']);
    }
	
	public function printdestroy(Request $request, $id)
    {
        Prints::where('id', $id)->delete();
		return response()->json(['message' => 'Data removed successfully']);
    }
	
	public function apigetsettings(Request $request)
    {	
		if($request['shop']){
			$Session = Session::where('shop', $request['shop'])->first();
			$settings = Setting::where('shop_id', $Session->id)->first();
			
			//$settings = Setting::where('shop_id', $Session->id)->where('product_tag',$request['tgas'])->first();
			$prints = Prints::where('setting_id', $settings->id)->get();
			
			//$settings = DB::table('settings')->leftJoin('prints', 'settings.id', '=', 'prints.setting_id')->where('settings.shop_id', $Session->id)->get();
			
			return response()->json(['status' => 200, "result" => "true", 'data'=>$settings, "prints" => $prints]);
		}else{
			return response()->json(['status' => 404]);
		}
    }
	
	
	/**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $Session = Session::where('shop', $request['shop'])->first();
            $save = Setting::updateOrCreate(
                [
                    'shop_id' => $Session->id
                ],
                [
                    'shop_id' => $Session->id,
                    'product_tag' => $request->product_tag,
                    'part_image' => $request->part_image,
                    'mask_image' => $request->mask_image,
                    'text_font_size' => $request->text_font_size,
                    'text_font_style' => $request->text_font_style,
                    'text_max_length' => $request->text_max_length,
                    'status' =>  $request->status
                ]
            );

            if ($save) {
                return response()->json(['message' => 'Data saved successfully']);
            } else {
				return response()->json(['message' => 'Something went wrong!']);
            }
        } catch (\Throwable $th) {
            dd($th);
        }
    }
}
