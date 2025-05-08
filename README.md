# React + Vite

How to run the project:

1. Clone the repository in a folder:

    ```bash
    git clone https://github.com/vazperale/simpleWebclientforTechnicalTestNode.git
    ```

2. Navigate to the project:

    ```bash
    cd organization-client
    ```

3. Install the dependencies:

    ```bash
    npm i
    ```

4. Create .env in the root project folder and add the following variable:

    ```bash
    VITE_API_URL = the url that the api run
    ```

5. Run the project:

    ```bash
    npm run dev
    ```

---------------------------------------------------------------------------------------------------------------------------------------

# Comments about the app:

-Header with cart that update when you add product to cart in pdp, breadcrumbs for navigate,and name/logo that return to home when you click it.

-PLP with infinite scroll, searchbar for filter with brand , model or both,  and change color when you do hover in product.Click in the product navigate to the pdp product.

-PDP with photo, details/description, selects for color and storage and button for add to the cart.When you add to the cart, an alert shows during 3 seconds to notice you that 
 the product was added to the cart. if you don´t select color and storage, the button was disabled to avoid errors.

 -Cache system for plp and pdp with 1 hour duration.

 -Added vitest but i didn´t add any test file yet, but if in the future if i add test files, vitest is configured to work correctly.
 
