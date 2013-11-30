class PeerConnectionController < ApplicationController

  def sendTestData
    render :peer_connection_sender_page
  end

  def receiveTestData
    render "peer_connection_receiver_page"
  end

end
