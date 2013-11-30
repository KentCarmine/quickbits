Quickbits::Application.routes.draw do
  resources :initiators
  root to: "initiators#index"
end
