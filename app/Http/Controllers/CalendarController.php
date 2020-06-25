<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Event;
use Illuminate\Support\Facades\Auth;

class CalendarController extends Controller
{
    public function index()
    {
        return view('index');
    }
    public function getEvent()
    {
        $listEvent = Event::orderBy('created_at', 'desc')->get();
        return $listEvent;
    }
    public function addEvent(Request $request)
    {
        if ($request->check) {
            // dd($request->all());
            $s = $request->except(['check']);
            $key = Event::find($request->id);
            $te = $key->update($s);
            return $te;
        } else {
            // dd($request->start);
            $add = Event::create($request->all());
        }
    }
    public function deleteEvent($id)
    {

        $s = Event::find($id)->delete();
        return $s;
    }
    public function login(Request $request)
    {
        $data = $request->all();
        if (Auth::attempt($data)) {
            $token = Auth::user()->createToken('my-app-token');
            // dd($token->accessToken);
            return response([
                'token' => $token,
                'user' => Auth::user()
            ]);
        } else {
            dd('misstake');
        }
    }
}
