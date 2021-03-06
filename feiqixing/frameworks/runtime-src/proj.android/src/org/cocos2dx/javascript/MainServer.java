package org.cocos2dx.javascript;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.Timer;
import java.util.TimerTask;

public class MainServer {

	public static MainServer app;
	private ServerSocket serverSocket;
	private Socket socket;
    private String _serverIp;
    private ArrayList<String> _allIps = new ArrayList<String>();
    private ArrayList<String> _allPlayers = new ArrayList<String>();
    private ArrayList<String> _winPlayers = new ArrayList<String>();
    private ArrayList<PrintWriter> pWriters = new ArrayList<PrintWriter>();
    
    private Boolean isStart = false;	// 开始游戏
    private int indexNow = 0;
    public Timer timer = null;
    private int _time = 0;
    private int _num = 0;
    private Boolean isEnd = false;	// 结束游戏
	
	public MainServer(String ip) {
		app = this;

//	   	 _allIps.clear();
		for(int i = 0; i < 4; i++) {
			_allIps.add("");
		}
	   	 _serverIp = ip;

    	 try {
			serverSocket = new ServerSocket(AppActivity.DEVICE_FIND_PORT);
		} catch (IOException e) {
			e.printStackTrace();
		}

         //创建接受客户端Socket读线程实例，并启动
           new AcceptSocketThread().start();
	}
	
	//接收客户端Socket套接字线程
    class AcceptSocketThread extends Thread{

		public void run() {
            while(this.isAlive()) {
                try {
                    //接收一个客户端Socket对象
                    Socket socket = serverSocket.accept();
                    //建立该客户端读通信管道
                    if(socket != null) {
                        //获取Socket对象读输入流
                    	BufferedReader bReader = new BufferedReader(new InputStreamReader(socket.getInputStream()));

                      //开启一个线程接收客户端读聊天信息
                        new GetMsgFromClient(bReader).start();
                        
                        //获取Socket对象读输出流，并添加到输入流列表集合中
                        pWriters.add(new PrintWriter(socket.getOutputStream()));
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                } 
            }
        }
    }
    
  //接收客户端读聊天信息读线程
    class GetMsgFromClient extends Thread{
        BufferedReader bReader;

        public GetMsgFromClient(BufferedReader bReader) {
            this.bReader = bReader;
        }

        public void run() {
            while(this.isAlive()) {
                String strMsg;
                try {
                    strMsg = bReader.readLine();
                    if(strMsg != null) {
                        checkMessage(strMsg);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

    }

	//向client发送消息
    public void sendToCilent(String str) {
    	System.out.println("send to client: " + str);
    	
    	for (int i = 0; i < pWriters.size(); i++) {
    		pWriters.get(i).println(str);
    		pWriters.get(i).flush();
        }
    }

    // 发送 更新房间人员
    public void updateSendIps() {
    	String ips = "";
    	int len = _allIps.size();
    	for(int i = 0; i < len; i++) {
    		ips += _allIps.get(i);
    		if (i < len - 1) {
    			ips += ",";
    		}
    	}
    	
    	sendToCilent("02" + ips);
    };
    
    // 发送 更新房间人员
    public void updateWinPlayers() {
    	String ips = "";
    	int len = _winPlayers.size();
    	for(int i = 0; i < len; i++) {
    		ips += _winPlayers.get(i);
    		if (i < len - 1) {
    			ips += ",";
    		}
    	}
    	
    	sendToCilent("09" + ips);
    	
    	if (len >= _allPlayers.size() - 1) {
    		isEnd = true;
    		if (timer != null) {
    			timer.cancel();
    			timer = null;
    		}
    	}
    };
    
    // 显示当前行动者
    private void showNowPlayer(Boolean isNext) {
    	if (isNext || _num != 6) {
    		indexNow++;
    		
	    	if (indexNow >= _allPlayers.size()) {
	    		indexNow = 0;
	    	}
		}
    	String ip = _allPlayers.get(indexNow);
    	
    	sendToCilent("05" + ip);

    	// 定时器
		_time = AppActivity.MOVE_TIME;
    	if (timer == null) {
    		timer = new Timer();
        	timer.schedule(updateTime(), 0, 1000);
    	}
    }
    
    private TimerTask updateTime() {
    	TimerTask task = new TimerTask() {
			
			@Override
			public void run() {
				_time--;
				if (_time > 0)
					return;

    	    	showNowPlayer(true);
			}
		};
		return task;
    }
	
	// 解析收到的消息
	private void checkMessage(String msg) {
		if (isEnd) {
			System.out.println("游戏结束...");
			return;
		}
		
        System.out.println("server get msg: " + msg);
        
        String objString = msg.toString();
    	String type = objString.substring(0, 2);
    	String str = objString.substring(2);
    	
//    	System.out.println("type: " + type);
//    	System.out.println("str: " + str);

    	if (type.equals("01")) {		// 添加成员
    		if (isStart) {
    			System.out.println("Game is Start...");
    			return;
    		}
    		
    		for(int i = 0; i < _allIps.size(); i++) {
				if (_allIps.get(i).isEmpty()) {
					_allIps.set(i, str);
					break;
				}
			}
        	app.updateSendIps();
        	
    	} else if (type.equals("03")) {		// 换颜色
    		String[] msg2 = str.split(",");
			for(int i = 0; i < _allIps.size(); i++) {
				if(_allIps.get(i).equals(msg2[0])) {
					int index = Integer.parseInt(msg2[1]);
					if (_allIps.get(index).isEmpty()) {
						_allIps.set(index, msg2[0]);
						_allIps.set(i, "");
					}
				}
			}
        	app.updateSendIps();
        	
    	} else if (type.equals("04")) {		// 开始游戏
    		sendToCilent("04");
    		
    		isStart = true;
    		
    		// 排序 0 2 3 1
    		if (!_allIps.get(0).isEmpty()) {
    			_allPlayers.add(_allIps.get(0));
    		}
    		if (!_allIps.get(2).isEmpty()) {
    			_allPlayers.add(_allIps.get(2));
    		}
    		if (!_allIps.get(3).isEmpty()) {
    			_allPlayers.add(_allIps.get(3));
    		}
    		if (!_allIps.get(1).isEmpty()) {
    			_allPlayers.add(_allIps.get(1));
    		}
    		
    		try {
				Thread.sleep(50);
				_num = 6;
				showNowPlayer(false);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
    		
    	} else if (type.equals("06")) {		// 开始甩筛子
    		_num = (int) Math.floor(Math.random() * 6) + 1;
    		sendToCilent("06" + _num + "," + _allPlayers.get(indexNow));
    		
    	} else if (type.equals("07")) {		// 选择行走棋子
    		sendToCilent("07" + str);
    		
    	} else if (type.equals("08")) {		// 行走结束
    		showNowPlayer(false);
    		
    	} else if (type.equals("09")) {		// 某玩家结束
    		_winPlayers.add(str);
    		
    		int len = _allPlayers.size();
    		for(int i = 0; i < len; i++) {
    			if (_allPlayers.get(i).equals(str)) {
    				_allPlayers.remove(i);
    				if (indexNow > 0) {
    					indexNow--;
    				}
    				break;
    			}
    		}
    		
    		updateWinPlayers();
    		
    	} else if (type.equals("10")) {		// 某玩家棋子被吃
    		sendToCilent("10" + str);
    	}
	}
}
