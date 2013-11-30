Quickbits::Application.routes.draw do
  get '/:connection_id', :to => 'receivers#show'
  resources :initiators
  root to: "initiators#index"
end
