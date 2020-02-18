<hr>

[Leopedia](https://steemleo.com/leopedia) / Leoshop Documentation

<hr>

<center><h1>A Digital Marketplace on the Blockchain</h1></center>
&nbsp;
<center>![](https://i.imgur.com/RVNz3zP.png)</center>
&nbsp;

 https://shop.steemleo.com is an open marketplace where sellers can post digital products & services and sell them in exchange for STEEM, SBD or LEO. We've integrated the Steem blockchain to handle a wide array of tasks such as:

1. Storing product data on the blockchain
2. User reviews using Steem blockchain accounts
3. Escrow functionality on the blockchain
4. and more!

To learn more about how Leoshop works and how you can buy and sell products on the blockchain, please follow the table of contents below.

<hr>

<h2>Table of Contents:</h2>

- <a href="#how-product-listings-are-stored">How Product Listings Are Stored on The Steem Blockchain</a>
- <a href="#how-steem-blockchain-accounts-are-used-for-product-reviews">How Steem Blockchain Accounts Are Used for Product Reviews</a>
- <a href="#escrow">Leoshop Escrow for Buyer/Seller Protection</a>


<h3>For Leoshop Buyers:</h3>

- <a href="#how-to-download-a-digital-product"> How to Download a Digital Product You Have Recently Purchased</a>
- <a href="#how-to-purchase-a-service">How to Purchase a Service From Leoshop (Non-Digital Downloads)</a>
- <a href="#how-to-write-a-review"> How to Write a Review on a Recent Purchase</a>
- <a href="#how-to-dispute-a-charge"> How to Dispute a Charge on a Recent Purchase</a>

<h3>For Leoshop Sellers:</h3>

- <a href="#list"> How to List Your Product on the Marketplace</a>
- <a href="#format">How to Format Your Product/Service</a>
- <a href="#withdraw">Withdraw Sales Revenue From Your Dashboard</a>
- <a href="#fees">Leoshop Seller Fees</a>
- <a href="#how-to-edit-a-product-listing">How to Edit a Product Listing</a>

<hr>

<h3><span id="how-product-listings-are-stored">How Product Listings Are Stored on The Steem Blockchain</span></h3>

When a seller submits a product listing to the Leoshop, it is automatically uploaded as a post on the Steem blockchain. Instead of making a main blog post (which would show up in the main blog feed of a Steem user), Leoshop posts are generated as comments under a direct parent. 

The direct parent is set to the first (and only) post on the @leoshop Steem account. If you click on this post, you'll see all the various product listings on there.

To summarize it, product listings are stored as comments under the @leoshop parent post and reviews are stored as comments under these comments. Don't fall into the inception trap.. it's actually pretty simple. 

- Top-level post by @leoshop
- 2nd level posts (direct comments beneath the top-level post) = product listings
- 3rd level posts (comments under product listings) = reviews

<h3><span id="#how-steem-blockchain-accounts-are-used-for-product-reviews">How Steem Blockchain Accounts Are Used for Product Reviews</span></h3>

When a user writes a review of a product they have purchased on the Leoshop, it is stored as a comment on the Steem blockchain and shown on the main Leoshop website beneath the product post.

One of the most common issues with online stores is the review system. It's hard to discern the validity of a review when you're looking at it online. When you get a review of something from a friend, you trust them because you know them and their history. 

Having a review system built on the blockchain provides a great deal of transparency and validation to our online marketplace that make it closer to "knowing" the person behind the review. Now, potential buyers can find products that have good reviews and they can even research the history of the account that made the review by diving into the wallet history, review history, blog history, comment history, etc. etc. etc. of the Steem account who bought and reviewed a product or service.

<h3><span id="escrow"> Leoshop Escrow for Buyer/Seller Protection:</span></h3>

The beauty of blockchain technology is that we have immutable transactions. The downside is that once a transaction is sent, it cannot be reversed. 

When you’re buying and selling products and especially services, it’s important to have some kind of buyer safety program so that a buyer cannot be scammed out of their money if a seller doesn’t live up to their end of the bargain. 

To mitigate this and instill a “buyer/seller safety” layer, we have build an escrow service for STEEM/SBD/LEO sales. When a buyer purchases your product, their funds are sent to the @leoshop escrow account.

For digital downloads, the escrow time period is automatically 7 days after purchase. The buyer has 7 days after clicking “Buy” to dispute the transaction and ask the Steemleo team to review the case for a fraudulent sale. 

For digital services, the escrow time period is set once the seller confirms that they have delivered the service. A seller does this buy going to the “Sales” tab on Leoshop and clicking “Fulfill” to indicate that the order has been fulfilled.

Once the order status indicates “Fulfilled”, the escrow countdown of 7 days begins. After 7 days, the funds are released to the seller’s dashboard.

![](https://i.imgur.com/Qhnjn4c.png)

<hr>

<h2>For Leoshop Buyers:</h2>

<h3><span id="how-to-download-a-digital-product">How to Download a Digital Product You Have Recently Purchased</span></h3>

To download a product that you have recently purchased, just head over to your "Orders" page (found in the dropdown menu when clicking your username in the top right corner of the site). 

Once on your "Orders" page, just find the product that you're looking to download and click the download icon (as seen in the screenshot below).

![](https://i.imgur.com/m5ENt9w.png)

Note: sometimes the tabs labeled "Paid Canceled Disputed Fulfilled" are selected in a manner that hides a recent purchase. If you have purchased a product and do not see it on this page, then try selecting each of these 4 options. Working your way from left to right.

<h3><span id="how-to-purchase-a-service">How to Purchase a Service From Leoshop (Non-Digital Downloads)</span></h3>

The sale and delivery of digital services on Leoshop is a bit more complex than digital download products. 

In Version 1 of Leoshop (the current version), we haven't yet built a chat system for buyers and sellers. Because of this, we require sellers of digital services to follow a more strict set of formatting guidelines. 

At the top of a "Service" that is listed for sale on the Leoshop, you will see the 3 following pieces of information:
1. Estimated Response Time
2. Estimated Delivery Time
3. How to Contact Us and/or Receive Delivery of this Service

Until the internal chat system is built for Leoshop, buyers of *Services* are expected to contact the seller **after** they have purchased a digital service in order to receive delivery of that service. There are also probably more details and conversations necessary to permit the exchange of a digital service (i.e. specifications, information, etc.). 

We realize that this is a crude way of exchanging information in regards to receiving the delivery of a digtial service. Leoshop Version 2 will not take long and the primary focus for that update will be the integration of a direct chat line between buyer and seller.

<h3><span id="how-to-write-a-review">How to Write a Review on a Recent Purchase</span></h3>

To write a review, simply go to your "Orders" page and click the *green comment icon*. It will display a popup for you to write a review on a particular order. 

![](https://i.imgur.com/FBHutc8.png)

This text field is styled in markdown, so you can style it similar to any post or comment on the Steem blockchain. Once you hit "Submit", your review is posted as a **comment** from your Steem blockchain account. The comment is posted **under** the parent post (the parent post is the main product post made by the seller).

<h3><span id="how-to-dispute-a-charge"> How to Dispute a Charge on a Recent Purchase</span></h3>

As mentioned previously, it's important to have a layer of buyer and seller protection. We manually review products and services that are uploaded to the Leoshop before they are available to purchase on the marketplace, but a secondary layer of protection is needed for buyers because of the finality of blockchain transactions.

When you buy a product on Leoshop, the funds you send are held in an escrow account:
- For digital products, these funds are released exactly 7 days after purchase.
- For digital services, these funds are released exactly 7 days afer the service has been marked as "Fulfilled"

If you need to dispute a purchase and have evidence that you have been wronged by the seller in some way, then please click the dispute button ASAP - if you try to dispute a charge **after** the 7 day escrow window is finalized, we will not be able to refund your purchase. After you click dispute, the Steemleo team will conduct a review of the charges and reason for dispute 

![](https://i.imgur.com/9pqQegr.png)

<hr>

<h2>For Leoshop Sellers:</h2>

<h3><span id="list">How to List Your Product on the Marketplace</span></h3>

<h4> Step 1). Login:</h4>

Login to Leoshop with your Steem username. 

![](https://i.imgur.com/VA7eDQ9.png)

<h4> Step 2). Click the Dropdown Menu and Select “Products":</h4>

![](https://i.imgur.com/LcFey1a.png)


<h4> Step 3). Click “Add Product”:</h4>

![](https://i.imgur.com/owj88zY.png)


<h4> Step 4). Fill Out the Product Form:</h4>

![](https://i.imgur.com/ZiXfgL9.png)


* **Title:** Title for your product
* **Description:** Description for your product. Products posted on Leoshop go to the Steem blockchain which means that this description field is formatted the same way as a Steem post. You can include images and all sorts of markdown styling features like tables, etc. There is a recommended formatting guide on this page. [Click here for the formatting guide](link)
* **Image:** Upload a featured image for your product
* **Image URL:** If you upload a featured image for your product in the field above, then it will auto-populate the image URL to this field. Alternatively, you can upload the featured image file to something like imgur and paste your own link in this field.
* **Price:** This is the price that the buyer will pay for your product (in USD). Products are purchased using either LEO/STEEM/SBD. The exchange rate is calculated in real-time. 
* **Stock:** This is the amount of total units available. This is typically irrelevant for most digital products as you can sell an infinite amount of them. If you want to sell a limited quantity, then put a limited amount in this field. Otherwise, just put 10000 or some large number here. 
* **Category:** Select a category from the available options for your product or service.
* **Type:** If you’re selling a digital download, then make sure to select the option for “Download” so that you can add the Product File in the field below it. Otherwise choose the option for “Service” and follow the [formatting instructions](link) to make sure that buyers know how to contact you to fulfill the service that you’re offering. 
* (FOR DIGITAL DOWNLOADS ONLY) — **Upload Product File:*** (This field will only show when you have selected “Download” as the “Type” of product you are selling). This last field is for uploading a private download which only buyers can access. For example, if you sell a digital ebook you would upload the ebook file in this section. When a buyer purchases the ebook on Leoshop, they will be able to download the digital file you uploaded here. Only users who are logged in AND have purchased the ebook will be able to see and download this file. 
&nbsp;

When you click submit, it will ask you to **confirm the post with a keychain transaction** (remember: uploading a product is the same as making a post on the blockchain. The post will **not** go to your Steemit blog feed but will instead be written as a comment on a parent post made by @leoshop).

<h4> Step 5). Wait for Product Approval:</h4>

After you submit a product, there is an approval process in which an admin from the Steemleo team must approve your product listing. We do this to ensure that the shop doesn’t get spammed with products and also to ensure that formatting guidelines have been met so that buyers have a pleasant experience when reviewing potential purchases. 

Products will always be approved in less than 24 hours provided that they meet our formatting guidelines. If you ever have any questions about a pending approval, contact us via the #tech-support channel on [Discord](link). 

<h4> Step 6). Sales:</h4>

Congratulations on successfully listing a product on Leoshop! Now that your product is available to the public, make sure to do some marketing and drive some leads back to your product page. 

If you’re selling a digital download, then you likely will have little-to-no upkeep for your product unless you send out a new version. 

If you’re selling a digital service, then the process is much more involved. When a buyer purchases your service, it is up to them to use the contact information in your product description. That is why it is so vital that you follow our [formatting guidelines](link) when uploading a product/service to Leoshop. 

<hr>

<h3><span id="format"> How to Format Your Product:</span></h3>

1. Digital Download Formatting:
2. Digital Service Formmating:

<h4> 1). Digital Download Formatting:</h4>

When you format your digital download, be sure to include a short description of what's included in the download. 

For example: If it's an ebook, include a compelling description of the book along with details that readers may find important like page count. If it's an online video course, include details like how many videos, how many hours worth of content, what they'll learn, etc. etc. 

In general, follow the formats that you would use on other product websites. Compelling copy with ample details aimed at closing the sale and providing buyers with a good idea of what they're purchasing. 

It is also a good idea (whether formatting for a digital download or service) to include pictures and/or a video that aid the explanation of what you're selling. Remember that these product listings are formmated the same way a Steem post is (with markdown styling). Creativity will help your listing to stand out.

<h4> 2). Digital Service Formatting:</h4>

When it comes to formatting digital services, the details are extremely important. 

The actual description of your service is completely up to you, but we require that it **starts** with the following 3 bullet points:

* Estimated Response Time:
* Estimated Delivery Time:
* How to Contact Us and/or Receive Delivery of this Service: 

The following image is a snippet from an [example service from the Steemleo team.](https://shop.steemleo.com/@steem.leo/k41llhef-labs-scotbot-setup-consultation) This is what the beginning of a digital service listing should look like as it ensures that the buyer knows how long it takes you to respond, deliver and how to get in touch with you:

![](https://i.imgur.com/qx0EsiX.png)

<hr>

<h3> <span id="withdraw"> Withdraw Sales Revenue From Your Dashboard:</span></h3>

Once the funds from a successful sale have been released out of escrow, a seller can retrieve the funds from their dashboard. Again, if you have any issues or questions related to this please reach out to Steemleo in the #tech-support channel on [discord](link). 

![](https://i.imgur.com/vqRi8L6.png)

<hr>

<h3> <span id="fees"> Leoshop Seller Fees</span></h3>

Gone are the days when you have to give up 5%-50% of your sales revenue to a centralized payments processor or an online marketplace that *lets* you list your product for sale. 

The only fee charged by Leoshop is a 1% fee of completed sales. When a sale is made, the seller receieves 99% of the proceeds and Leoshop retains 1%, which is used to burn LEO (permanently remove the tokens from the total supply).

There are no fees for the buyer and no additional hidden fees for sellers. Simple, easy, fast and without the hassles of routing numbers and all the other banking jargon. 

<h3> <span id="how-to-edit-a-product-listing">How to Edit a Product Listing</span></h3>

The easiest way to edit a product that you have already listed on the Leoshop is to simply go directly to the "blockchain version" of it on https://steemleo.com/steemleo/@leoshop/leoshop-products.

Just scroll down into the comments and find your listing (or do CTRL + F in your browser and search by your Steem username for faster access)

Once there, click the "Edit" button at the bottom of the comment to edit the markdown data for your post. Here you can enter all the product info you want to add/change/delete including images and other changes. 

![](https://i.imgur.com/RvHzoXL.png)


Certain features (such as changing the price of your product) require a re-upload of the product data on https://shop.steemleo.com. We also recommend taking down the previous listing of that product to avoid confusion. 